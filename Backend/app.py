from flask import Flask
from config import Config
from extensions import mongo, jwt, mail
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    CORS(app, origins=["http://localhost:5173"])

    mongo.init_app(app)
    jwt.init_app(app)
    mail.init_app(app)

    from routes.auth_routes import auth_bp
    from routes.service_routes import service_bp
    from routes.booking_routes import booking_bp  
    from routes.payment_routes import payment_bp

    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(service_bp, url_prefix="/api/services")
    app.register_blueprint(booking_bp, url_prefix="/api/bookings")  
    app.register_blueprint(payment_bp, url_prefix="/api/payments")

    return app

app = create_app()

if __name__ == "__main__":
    app.run(debug=True, use_reloader=False)
