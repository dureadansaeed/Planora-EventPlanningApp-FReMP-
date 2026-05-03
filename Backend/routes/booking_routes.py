import random
import string
from datetime import datetime, date
import re
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from extensions import mongo
from bson import ObjectId

booking_bp = Blueprint("bookings", __name__)

def generate_booking_id():
    return "BK" + "".join(random.choices(string.digits, k=8))


def get_current_user():
    user_email = get_jwt_identity()
    user = mongo.db.users.find_one({"email": user_email})
    return user_email, user


def require_admin():
    user_email, user = get_current_user()
    if not user or user.get("role") != "admin":
        return None, jsonify({"error": "Admin access required"}), 403
    return user, None, None


def serialize_timeslot(slot, include_booked_times=False):
    slot["_id"] = str(slot["_id"])
    slot["times"] = sorted(slot.get("times", []))
    if include_booked_times:
        slot["booked_times"] = get_booked_times_for_date(slot.get("date", ""))
    return slot


def normalize_times(times):
    if isinstance(times, str):
        items = times.split(",")
    elif isinstance(times, list):
        items = times
    else:
        items = []

    normalized = []
    seen = set()
    for item in items:
        value = str(item).strip()
        if value and value not in seen:
            seen.add(value)
            normalized.append(value)
    return sorted(normalized)


def _time_key(t):
    if not t:
        return ""
    return re.sub(r"\s+", "", str(t)).lower()


def format_display_date(date_str):
    try:
        return datetime.strptime(date_str, "%Y-%m-%d").strftime("%a, %b %d, %Y")
    except Exception:
        return date_str


def parse_slot_date(date_str):
    try:
        parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
    except ValueError:
        return None, "Enter a valid calendar date"

    if parsed_date < date.today():
        return None, "Date cannot be before today"

    return parsed_date, None


def get_booked_times_for_date(date_str, exclude_booking_id=None):
    query = {
        "event_date": date_str,
        "status": {"$nin": ["rejected", "cancelled"]},
    }
    if exclude_booking_id:
        query["booking_id"] = {"$ne": exclude_booking_id}

    bookings = list(mongo.db.bookings.find(query, {"event_time": 1, "_id": 0}))
    booked = {
        booking.get("event_time", "").strip()
        for booking in bookings
        if booking.get("event_time")
    }
    return sorted(booked)


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
            "updated_at": datetime.now().isoformat(),
        }}
    )


def restore_time_to_slot(date_str, event_time):
    slot = mongo.db.timeslots.find_one({"date": date_str})
    if not slot:
        return

    times = normalize_times(slot.get("times", []))
    if event_time not in times:
        times.append(event_time)

    mongo.db.timeslots.update_one(
        {"_id": slot["_id"]},
        {"$set": {
            "times": sorted(times),
            "is_active": True,
            "updated_at": datetime.now().isoformat(),
        }}
    )


def build_available_timeslots():
    timeslots = list(mongo.db.timeslots.find({"is_active": True}))
    available = []

    for slot in timeslots:
        date = slot.get("date", "")
        parsed_date, error = parse_slot_date(date)
        if error or not parsed_date:
            continue

        booked_times = set(get_booked_times_for_date(date))
        open_times = [time for time in normalize_times(slot.get("times", [])) if time not in booked_times]

        if open_times:
            slot["times"] = open_times
            available.append(serialize_timeslot(slot))

    available.sort(key=lambda item: item.get("date", ""))
    return available


def validate_slot_payload(data):
    if not data:
        return None, "No data provided"

    date = str(data.get("date", "")).strip()
    times = normalize_times(data.get("times", []))

    if not date:
        return None, "Date is required"
    if not times:
        return None, "At least one time is required"

    parsed_date, error = parse_slot_date(date)
    if error:
        return None, error

    payload = {
        "date": parsed_date.isoformat(),
        "display_date": format_display_date(parsed_date.isoformat()),
        "times": times,
        "is_active": bool(data.get("is_active", True)),
        "updated_at": datetime.now().isoformat(),
    }
    return payload, None


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


def attach_service_details(booking, allow_deleted_snapshot=False):
    snapshot = booking.get("service_snapshot")
    if snapshot and allow_deleted_snapshot:
        booking["service"] = snapshot

    service_id = booking.get("service_id")
    if not service_id:
        if not allow_deleted_snapshot:
            booking["service"] = None
        return booking

    try:
        service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
        if service:
            booking["service"] = build_service_snapshot(service)
            booking["service_deleted"] = False
        else:
            booking["service_deleted"] = True
            if allow_deleted_snapshot and snapshot:
                booking["service"] = snapshot
            else:
                booking["service"] = None
    except Exception:
        booking["service_deleted"] = True
        if allow_deleted_snapshot and snapshot:
            booking["service"] = snapshot
        else:
            booking["service"] = None

    return booking


@booking_bp.route("/timeslots/available", methods=["GET"])
def get_available_timeslots():
    return jsonify(build_available_timeslots()), 200


@booking_bp.route("/timeslots", methods=["GET"])
@jwt_required()
def get_all_timeslots():
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    slots = [serialize_timeslot(slot, include_booked_times=True) for slot in mongo.db.timeslots.find()]
    slots.sort(key=lambda x: x.get("date", ""))
    return jsonify(slots), 200


@booking_bp.route("/timeslots", methods=["POST"])
@jwt_required()
def create_timeslot():
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    payload, error = validate_slot_payload(request.get_json())
    if error:
        return jsonify({"error": error}), 400

    existing = mongo.db.timeslots.find_one({"date": payload["date"]})
    if existing:
        return jsonify({"error": "A timeslot entry already exists for this date"}), 409

    payload["created_at"] = datetime.now().isoformat()
    result = mongo.db.timeslots.insert_one(payload)
    payload["_id"] = str(result.inserted_id)
    payload["booked_times"] = []
    return jsonify(payload), 201


@booking_bp.route("/timeslots/<slot_id>", methods=["PUT"])
@jwt_required()
def update_timeslot(slot_id):
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    try:
        object_id = ObjectId(slot_id)
    except Exception:
        return jsonify({"error": "Invalid timeslot ID"}), 400

    existing = mongo.db.timeslots.find_one({"_id": object_id})
    if not existing:
        return jsonify({"error": "Timeslot not found"}), 404

    payload, error = validate_slot_payload(request.get_json())
    if error:
        return jsonify({"error": error}), 400

    duplicate = mongo.db.timeslots.find_one({"date": payload["date"], "_id": {"$ne": object_id}})
    if duplicate:
        return jsonify({"error": "Another timeslot entry already uses this date"}), 409

    booked_times = get_booked_times_for_date(existing.get("date", ""))
    missing_booked_times = [time for time in booked_times if time not in payload["times"]]
    if missing_booked_times:
        return jsonify({
            "error": "You cannot remove times that already have active bookings",
            "booked_times": missing_booked_times,
        }), 409

    if payload["date"] != existing.get("date", ""):
        active_booking = mongo.db.bookings.find_one({
            "event_date": existing.get("date", ""),
            "status": {"$nin": ["rejected", "cancelled"]},
        })
        if active_booking:
            return jsonify({"error": "This date cannot be changed because active bookings already exist on it"}), 409

    mongo.db.timeslots.update_one({"_id": object_id}, {"$set": payload})
    updated = mongo.db.timeslots.find_one({"_id": object_id})
    return jsonify(serialize_timeslot(updated, include_booked_times=True)), 200


@booking_bp.route("/timeslots/<slot_id>", methods=["DELETE"])
@jwt_required()
def delete_timeslot(slot_id):
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    try:
        object_id = ObjectId(slot_id)
    except Exception:
        return jsonify({"error": "Invalid timeslot ID"}), 400

    slot = mongo.db.timeslots.find_one({"_id": object_id})
    if not slot:
        return jsonify({"error": "Timeslot not found"}), 404

    active_booking = mongo.db.bookings.find_one({
        "event_date": slot.get("date", ""),
        "status": {"$nin": ["rejected", "cancelled"]},
    })
    if active_booking:
        return jsonify({"error": "This timeslot cannot be deleted because active bookings already exist on that date"}), 409

    mongo.db.timeslots.delete_one({"_id": object_id})
    return jsonify({"success": True, "message": "Timeslot deleted successfully"}), 200


@booking_bp.route("/create", methods=["POST"])
@jwt_required()
def create_booking():
    user_email, user = get_current_user()
    user_name = user.get("name", "") if user else ""

    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    service_id = data.get("service_id")
    event_date = data.get("event_date")
    event_time = data.get("event_time")
    contact = data.get("contact_number")

    if not all([service_id, event_date, event_time, contact]):
        return jsonify({"error": "Missing required booking details"}), 400

    # Normalize incoming date/time formats from frontend (handle ISO datetimes)
    if isinstance(event_date, str) and 'T' in event_date:
        event_date = event_date.split('T')[0]

    # Ensure date stored in DB format (YYYY-MM-DD)
    try:
        parsed_event_date = datetime.strptime(str(event_date), "%Y-%m-%d").date()
        event_date_iso = parsed_event_date.isoformat()
    except Exception:
        return jsonify({"error": "Invalid event_date format. Use YYYY-MM-DD."}), 400

    slot = mongo.db.timeslots.find_one({"date": event_date_iso, "is_active": True})
    if not slot:
        return jsonify({"error": "Selected date is no longer available"}), 409

    # Normalize times for robust comparison (ignore spacing/case)
    valid_times = normalize_times(slot.get("times", []))
    norm_valid = {_time_key(t): t for t in valid_times}
    matched_key = _time_key(event_time)
    if matched_key not in norm_valid:
        return jsonify({"error": "Selected time is not configured for this date"}), 409

    # Use canonical stored time string
    canonical_time = norm_valid[matched_key]

    booked_keys = {_time_key(t) for t in get_booked_times_for_date(event_date_iso)}
    if matched_key in booked_keys:
        return jsonify({"error": "Selected time has already been booked"}), 409

    try:
        service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
    except Exception:
        return jsonify({"error": "Invalid service ID"}), 400

    if not service:
        return jsonify({"error": "Service not found"}), 404

    price = str(service.get("price", "0")).replace("$", "").replace(",", "")

    booking_id = generate_booking_id()
    new_booking = {
        "booking_id": booking_id,
        "user_name": user_name,
        "user_email": user_email,
        "service_id": service_id,
        "service_snapshot": build_service_snapshot(service),
        "service_deleted": False,
        "event_date": event_date_iso,
        "event_time": canonical_time,
        "event_theme": data.get("event_theme", ""),
        "event_location": data.get("event_location", ""),
        "contact_number": contact,
        "status": "pending",
        "payment_status": "unpaid",
        "total_amount": f"${price}",
        "created_at": datetime.now().isoformat(),
        "updated_at": datetime.now().isoformat(),
        "admin_note": ""
    }

    result = mongo.db.bookings.insert_one(new_booking)
    new_booking["_id"] = str(result.inserted_id)
    new_booking["service"] = new_booking["service_snapshot"]
    remove_time_from_slot(event_date, event_time)

    return jsonify(new_booking), 201


@booking_bp.route("/<booking_id>", methods=["GET"])
def get_booking(booking_id):
    booking = mongo.db.bookings.find_one({"booking_id": booking_id})
    if not booking:
        return jsonify({"error": "Booking not found"}), 404

    booking["_id"] = str(booking["_id"])
    booking = attach_service_details(booking, allow_deleted_snapshot=False)

    return jsonify(booking), 200


@booking_bp.route("/my", methods=["GET"])
@jwt_required()
def get_my_bookings():
    user_email = get_jwt_identity()
    bookings = list(mongo.db.bookings.find({"user_email": user_email}))
    for b in bookings:
        b["_id"] = str(b["_id"])
        b = attach_service_details(b, allow_deleted_snapshot=False)
    bookings.sort(key=lambda x: x.get("created_at", ""), reverse=True)
    return jsonify(bookings), 200


@booking_bp.route("/all", methods=["GET"])
@jwt_required()
def get_all_bookings():
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    bookings = list(mongo.db.bookings.find())
    for b in bookings:
        b["_id"] = str(b["_id"])
        b = attach_service_details(b, allow_deleted_snapshot=True)
    return jsonify(bookings), 200


@booking_bp.route("/approve/<booking_id>", methods=["PUT"])
@jwt_required()
def approve_booking(booking_id):
    try:
        _, error_response, status_code = require_admin()
        if error_response:
            return error_response, status_code

        booking = mongo.db.bookings.find_one({"booking_id": booking_id})
        if not booking:
            return jsonify({"error": "Booking not found"}), 404

        user_email = booking.get("user_email", "") if booking else ""
        user_name = booking.get("user_name", "Valued Customer") if booking else "Valued Customer"
        service_id = booking.get("service_id", "") if booking else ""
        snapshot = booking.get("service_snapshot", {}) if booking else {}
        event_date = booking.get("event_date", "") if booking else ""
        event_time = booking.get("event_time", "") if booking else ""
        event_location = booking.get("event_location", "") if booking else ""
        total_amount = booking.get("total_amount", "") if booking else ""

        service_title = snapshot.get("title", "")
        if service_id:
            try:
                service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
                if service:
                    service_title = service.get("title", "")
            except Exception:
                pass

        mongo.db.bookings.update_one(
            {"booking_id": booking_id},
            {"$set": {"status": "approved", "updated_at": datetime.now().isoformat()}}
        )

        if user_email:
            from flask_mail import Message
            from extensions import mail
            msg = Message(
                subject="Your Planora Booking is Confirmed!",
                recipients=[user_email],
                body=f"""Dear {user_name},

Great news! Your booking has been approved.

Booking ID: #{booking_id}
Service: {service_title}
Date: {event_date}
Time: {event_time}
Location: {event_location if event_location else 'TBD'}
Total Amount: {total_amount}

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

        return jsonify({"success": True, "message": "Booking approved and email sent"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@booking_bp.route("/reject/<booking_id>", methods=["PUT"])
@jwt_required()
def reject_booking(booking_id):
    try:
        _, error_response, status_code = require_admin()
        if error_response:
            return error_response, status_code

        booking = mongo.db.bookings.find_one({"booking_id": booking_id})
        if not booking:
            return jsonify({"error": "Booking not found"}), 404

        user_email = booking.get("user_email", "") if booking else ""
        user_name = booking.get("user_name", "Valued Customer") if booking else "Valued Customer"
        payment_status = booking.get("payment_status", "unpaid") if booking else "unpaid"
        service_id = booking.get("service_id", "") if booking else ""
        snapshot = booking.get("service_snapshot", {}) if booking else {}
        event_date = booking.get("event_date", "") if booking else ""

        service_title = snapshot.get("title", "")
        if service_id:
            try:
                service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
                if service:
                    service_title = service.get("title", "")
            except Exception:
                pass

        update_fields = {"status": "rejected", "updated_at": datetime.now().isoformat()}
        if payment_status == "paid":
            update_fields["payment_status"] = "refunded"

        mongo.db.bookings.update_one(
            {"booking_id": booking_id},
            {"$set": update_fields}
        )
        restore_time_to_slot(booking.get("event_date", ""), booking.get("event_time", ""))

        if user_email:
            from flask_mail import Message
            from extensions import mail
            msg = Message(
                subject="Update on Your Planora Booking",
                recipients=[user_email],
                body=f"""Dear {user_name},

We regret to inform you that your booking request has been rejected.

Booking ID: #{booking_id}
Service: {service_title}
Date: {event_date}

{"A refund will be processed shortly as your payment has been captured." if payment_status == "paid" else ""}

If you have any questions, please contact us at support@planora.com

Thank you for choosing Planora.

Best regards,
The Planora Team
"""
            )
            try:
                mail.send(msg)
            except Exception as e:
                print(f"Mail failed: {str(e)}")

        return jsonify({"success": True, "message": "Booking rejected"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


@booking_bp.route("/cancel/<booking_id>", methods=["PUT"])
@jwt_required()
def cancel_booking(booking_id):
    try:
        _, error_response, status_code = require_admin()
        if error_response:
            return error_response, status_code

        booking = mongo.db.bookings.find_one({"booking_id": booking_id})
        if not booking:
            return jsonify({"error": "Booking not found"}), 404

        mongo.db.bookings.update_one(
            {"booking_id": booking_id},
            {"$set": {"status": "cancelled", "updated_at": datetime.now().isoformat()}}
        )
        restore_time_to_slot(booking.get("event_date", ""), booking.get("event_time", ""))
        return jsonify({"success": True, "message": "Booking cancelled"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
