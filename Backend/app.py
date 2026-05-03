from flask import Flask
from config import Config
from extensions import mongo, jwt, mail
from flask_cors import CORS

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    #added because of CORS error when trying to access backend from frontend
    @app.route("/")
    def home():
        return {"message": "Planora Backend is running successfully!"}

    #CORS(app, origins=["http://localhost:5173"])
   # CORS(app, origins=["http://localhost:5173"])
   
   #added this to make it work on both local and deployed frontend
    CORS(app, origins=[
    "http://localhost:5173",
    "https://planora-event-planning-app-f-re-mp.vercel.app"
])

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
