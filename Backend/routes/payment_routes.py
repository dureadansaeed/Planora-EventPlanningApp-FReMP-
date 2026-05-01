from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo
import datetime
import random
import string
from bson import ObjectId

payment_bp = Blueprint("payments", __name__)


def generate_booking_id():
    return "BK" + "".join(random.choices(string.digits, k=8))


def attach_service_details(booking):
    snapshot = booking.get("service_snapshot")
    if snapshot:
        booking["service"] = snapshot

    service_id = booking.get("service_id")
    if not service_id:
        return booking

    try:
        service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
        if service:
            booking["service"] = {
                "title": service.get("title"),
                "description": service.get("description"),
                "duration": service.get("duration"),
                "image": service.get("image"),
                "price": service.get("price"),
            }
    except Exception:
        pass

    return booking


def build_service_snapshot(service):
    return {
        "title": service.get("title", ""),
        "description": service.get("description", ""),
        "duration": service.get("duration", ""),
        "image": service.get("image", ""),
        "price": service.get("price", ""),
        "category": service.get("category", ""),
        "details": service.get("details", ""),
    }


def normalize_times(times):
    normalized = []
    seen = set()
    for item in times or []:
        value = str(item).strip()
        if value and value not in seen:
            seen.add(value)
            normalized.append(value)
    return sorted(normalized)


def get_booked_times_for_date(date_str, exclude_booking_id=None):
    query = {
        "event_date": date_str,
        "status": {"$nin": ["rejected", "cancelled"]},
    }
    if exclude_booking_id:
        query["booking_id"] = {"$ne": exclude_booking_id}

    bookings = list(mongo.db.bookings.find(query, {"event_time": 1, "_id": 0}))
    return {
        booking.get("event_time", "").strip()
        for booking in bookings
        if booking.get("event_time")
    }


def remove_time_from_slot(date_str, event_time):
    slot = mongo.db.timeslots.find_one({"date": date_str})
    if not slot:
        return

    remaining_times = [time for time in normalize_times(slot.get("times", [])) if time != event_time]
    mongo.db.timeslots.update_one(
        {"_id": slot["_id"]},
        {"$set": {
            "times": remaining_times,
            "is_active": bool(remaining_times),
            "updated_at": datetime.datetime.now().isoformat(),
        }}
    )


@payment_bp.route("/create", methods=["POST"])
@jwt_required()
def process_payment():
    data = request.json
    if not data:
        return jsonify({"error": "No payment data provided"}), 400

    user_email = get_jwt_identity()
    user = mongo.db.users.find_one({"email": user_email})
    user_name = user.get("name", "") if user else ""

    booking_id = data.get("booking_id")
    total_amount = data.get("total_amount")
    card_number = data.get("card_number")
    expiry_date = data.get("expiry_date")
    cvv = data.get("cvv")

    if not all([card_number, expiry_date, cvv]):
        return jsonify({"error": "Missing payment information"}), 400

    booking = None

    if booking_id:
        booking = mongo.db.bookings.find_one({"booking_id": booking_id})
        if not booking:
            return jsonify({"error": "Booking not found"}), 404

        if booking.get("user_email") != user_email:
            return jsonify({"error": "You can only pay for your own booking"}), 403

        if booking.get("payment_status") == "paid":
            return jsonify({"error": "This booking has already been paid"}), 400

        total_amount = booking.get("total_amount", total_amount)
    else:
        service_id = data.get("service_id")
        event_date = data.get("event_date")
        event_time = data.get("event_time")
        contact_number = data.get("contact_number")

        if not all([service_id, event_date, event_time, contact_number]):
            return jsonify({"error": "Missing booking details"}), 400

        slot = mongo.db.timeslots.find_one({"date": event_date, "is_active": True})
        if not slot:
            return jsonify({"error": "Selected date is no longer available"}), 409

        valid_times = normalize_times(slot.get("times", []))
        if event_time not in valid_times:
            return jsonify({"error": "Selected time is not configured for this date"}), 409

        if event_time in get_booked_times_for_date(event_date):
            return jsonify({"error": "Selected time has already been booked"}), 409

        try:
            service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
        except Exception:
            return jsonify({"error": "Invalid service ID"}), 400

        if not service:
            return jsonify({"error": "Service not found"}), 404

        normalized_price = str(service.get("price", "0")).replace("$", "").replace(",", "")
        total_amount = f"${normalized_price}"
        booking_id = generate_booking_id()

        booking = {
            "booking_id": booking_id,
            "user_name": user_name,
            "user_email": user_email,
            "service_id": service_id,
            "service_snapshot": build_service_snapshot(service),
            "service_deleted": False,
            "event_date": event_date,
            "event_time": event_time,
            "event_theme": data.get("event_theme", ""),
            "event_location": data.get("event_location", ""),
            "contact_number": contact_number,
            "status": "pending",
            "payment_status": "unpaid",
            "total_amount": total_amount,
            "created_at": datetime.datetime.now().isoformat(),
            "updated_at": datetime.datetime.now().isoformat(),
            "admin_note": "",
        }

        result = mongo.db.bookings.insert_one(booking)
        booking["_id"] = str(result.inserted_id)

    last4 = "".join(card_number.split())[-4:]
    masked_card = f".... .... .... {last4}"
    transaction_id = "TXN-" + datetime.datetime.now().strftime("%Y%m%d") + "-" + str(id(data))[-6:]

    mongo.db.bookings.update_one(
        {"booking_id": booking_id},
        {"$set": {
            "payment_status": "paid",
            "card_last_four": last4,
            "transaction_id": transaction_id,
            "masked_card": masked_card,
            "updated_at": datetime.datetime.now().isoformat(),
        }}
    )
    if booking:
        remove_time_from_slot(booking.get("event_date", ""), booking.get("event_time", ""))

    mongo.db.payments.insert_one({
        "booking_id": booking_id,
        "user_email": user_email,
        "amount": total_amount,
        "card_last_four": last4,
        "status": "success",
        "transaction_id": transaction_id,
        "paid_at": datetime.datetime.now().isoformat(),
    })

    booking = mongo.db.bookings.find_one({"booking_id": booking_id})
    if booking:
        booking["_id"] = str(booking["_id"])
        booking = attach_service_details(booking)

    if user_email:
        from flask_mail import Message
        from extensions import mail

        msg = Message(
            subject=f"Planora: Payment Received - #{booking_id}",
            recipients=[user_email],
            body=f"""Dear {user_name},

Your payment has been received successfully!

Booking ID: #{booking_id}
Transaction ID: {transaction_id}
Amount Paid: {total_amount}
Card: {masked_card}

Your booking is now under review. You will receive another email once the admin confirms your booking.

Thank you for choosing Planora!

Best regards,
The Planora Team
support@planora.com
"""
        )
        try:
            mail.send(msg)
        except Exception as e:
            print(f"Mail failed: {str(e)}")

    return jsonify({
        "success": True,
        "transaction_id": transaction_id,
        "masked_card": masked_card,
        "amount": total_amount,
        "booking_id": booking_id,
        "booking": booking,
    }), 201
