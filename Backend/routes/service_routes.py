from datetime import datetime
from flask import Blueprint, jsonify, request
from flask_jwt_extended import get_jwt_identity, jwt_required
from flask_mail import Message
from models.service_model import get_all_services
from extensions import mail, mongo
from bson import ObjectId

service_bp = Blueprint("services", __name__)


def get_current_user():
    user_email = get_jwt_identity()
    user = mongo.db.users.find_one({"email": user_email})
    return user_email, user


def require_admin():
    _, user = get_current_user()
    if not user or user.get("role") != "admin":
        return None, jsonify({"error": "Admin access required"}), 403
    return user, None, None


def serialize_service(service):
    if not service:
        return None
    service["_id"] = str(service["_id"])
    return service


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


def restore_time_to_slot(date_str, event_time):
    if not date_str or not event_time:
        return

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


def send_service_removed_email(booking, service_title):
    user_email = booking.get("user_email", "")
    if not user_email:
        return

    user_name = booking.get("user_name", "Valued Customer")
    booking_id = booking.get("booking_id", "")
    event_date = booking.get("event_date", "")
    payment_status = booking.get("payment_status", "unpaid")

    body = f"""Dear {user_name},

We regret to inform you that your booking request has been rejected because the selected service is no longer available.

Booking ID: #{booking_id}
Service: {service_title}
Date: {event_date}

{"A refund will be processed shortly as your payment has been captured." if payment_status == "paid" else ""}

If you have any questions, please contact us at support@planora.com

Thank you for choosing Planora.

Best regards,
The Planora Team
"""

    msg = Message(
        subject="Update on Your Planora Booking",
        recipients=[user_email],
        body=body,
    )

    try:
        mail.send(msg)
    except Exception as exc:
        print(f"Mail failed: {str(exc)}")


def parse_price(value):
    if value in (None, ""):
        return None

    if isinstance(value, (int, float)):
        return int(value) if float(value).is_integer() else float(value)

    cleaned = str(value).replace("$", "").replace(",", "").strip()
    if not cleaned:
        return None

    amount = float(cleaned)
    return int(amount) if amount.is_integer() else amount


def validate_service_payload(data):
    if not data:
        return None, "No data provided"

    title = str(data.get("title", "")).strip()
    description = str(data.get("description", "")).strip()
    try:
        price = parse_price(data.get("price"))
    except ValueError:
        return None, "Service price must be a valid number"

    if not title:
        return None, "Service title is required"
    if not description:
        return None, "Service description is required"
    if price is None:
        return None, "Service price is required"

    payload = {
        "title": title,
        "description": description,
        "category": str(data.get("category", "")).strip(),
        "duration": str(data.get("duration", "")).strip(),
        "details": str(data.get("details", "")).strip(),
        "image": str(data.get("image", "")).strip(),
        "price": price,
        "updated_at": datetime.now().isoformat(),
    }

    if not payload["category"]:
        payload["category"] = "Event"
    if not payload["duration"]:
        payload["duration"] = "Flexible"

    return payload, None

@service_bp.route("/", methods=["GET"])
def list_services():
    services = get_all_services()
    return jsonify(services), 200


@service_bp.route("/", methods=["POST"])
@jwt_required()
def create_service():
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    payload, error = validate_service_payload(request.get_json())
    if error:
        return jsonify({"error": error}), 400

    payload["created_at"] = datetime.now().isoformat()
    result = mongo.db.services.insert_one(payload)
    payload["_id"] = str(result.inserted_id)
    return jsonify(payload), 201


@service_bp.route("/<service_id>", methods=["GET"])
def get_service(service_id):
    try:
        service = mongo.db.services.find_one({"_id": ObjectId(service_id)})
    except Exception:
        return jsonify({"error": "Invalid service ID"}), 400

    if not service:
        return jsonify({"error": "Service not found"}), 404

    return jsonify(serialize_service(service)), 200


@service_bp.route("/<service_id>", methods=["PUT"])
@jwt_required()
def update_service(service_id):
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    try:
        object_id = ObjectId(service_id)
    except Exception:
        return jsonify({"error": "Invalid service ID"}), 400

    existing = mongo.db.services.find_one({"_id": object_id})
    if not existing:
        return jsonify({"error": "Service not found"}), 404

    payload, error = validate_service_payload(request.get_json())
    if error:
        return jsonify({"error": error}), 400

    mongo.db.services.update_one({"_id": object_id}, {"$set": payload})
    updated = mongo.db.services.find_one({"_id": object_id})
    return jsonify(serialize_service(updated)), 200


@service_bp.route("/<service_id>", methods=["DELETE"])
@jwt_required()
def delete_service(service_id):
    _, error_response, status_code = require_admin()
    if error_response:
        return error_response, status_code

    try:
        object_id = ObjectId(service_id)
    except Exception:
        return jsonify({"error": "Invalid service ID"}), 400

    existing = mongo.db.services.find_one({"_id": object_id})
    if not existing:
        return jsonify({"error": "Service not found"}), 404

    service_title = existing.get("title", "Selected Service")
    snapshot = build_service_snapshot(existing)
    affected_bookings = list(mongo.db.bookings.find({
        "service_id": service_id,
        "status": {"$nin": ["rejected", "cancelled"]},
    }))

    for booking in affected_bookings:
        update_fields = {
            "status": "rejected",
            "service_snapshot": snapshot,
            "service_deleted": True,
            "updated_at": datetime.now().isoformat(),
            "admin_note": "Booking automatically rejected because the service was removed by admin.",
        }

        if booking.get("payment_status") == "paid":
            update_fields["payment_status"] = "refunded"

        mongo.db.bookings.update_one({"_id": booking["_id"]}, {"$set": update_fields})
        restore_time_to_slot(booking.get("event_date", ""), booking.get("event_time", ""))
        send_service_removed_email(booking, service_title)

    mongo.db.bookings.update_many(
        {"service_id": service_id},
        {"$set": {
            "service_snapshot": snapshot,
            "service_deleted": True,
            "updated_at": datetime.now().isoformat(),
        }}
    )

    mongo.db.services.delete_one({"_id": object_id})
    return jsonify({"success": True, "message": "Service deleted successfully"}), 200
