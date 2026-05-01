from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from models.user_model import create_user, find_user_by_email

auth_bp = Blueprint("auth", __name__)
bcrypt = Bcrypt()

# USER REGISTRATION
@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json()

    if not data:
        return jsonify({"message": "No data received"}), 400

    email = data.get("email")
    name = data.get("name")
    password = data.get("password")
    number = data.get("number")

    if not email or not password or not name:
        return jsonify({"message": "Missing required fields"}), 400

    existing_user = find_user_by_email(email)
    if existing_user:
        return jsonify({"message": "User already exists"}), 400

    hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

    user_data = {
        "name": name,
        "email": email,
        "number": number,
        "password": hashed_password,
        "role": "user"
    }

    create_user(user_data)

    return jsonify({"message": "User registered successfully"}), 201


# LOGIN (USER + ADMIN)
@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json()

    user = find_user_by_email(data["email"])
    if not user:
        return jsonify({"message": "User not found"}), 404

    if not bcrypt.check_password_hash(user["password"], data["password"]):
        return jsonify({"message": "Invalid password"}), 401

    access_token = create_access_token(identity=user["email"])

    return jsonify({
        "message": "Login successful",
        "token": access_token,
        "role": user["role"],
        "name": user["name"]
    }), 200