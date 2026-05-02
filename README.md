# 🌸 Planora — Event Management Web Application

> A full-stack event management platform that connects users with professional event planning services. Users can browse services, make bookings, and process payments — while admins manage the entire platform from a dedicated dashboard.

---

## 📸 Preview

| User Dashboard | Services Page | Admin Bookings |
|---|---|---|
| Browse featured services | View service details and book | Approve or reject bookings |

---

## 🚀 Tech Stack

### Frontend
![React](https://img.shields.io/badge/React-18-61DAFB?style=flat&logo=react)
![Vite](https://img.shields.io/badge/Vite-4-646CFF?style=flat&logo=vite)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6-F7DF1E?style=flat&logo=javascript)

### Backend
![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=flat&logo=python)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?style=flat&logo=flask)
![JWT](https://img.shields.io/badge/JWT-Extended-000000?style=flat&logo=jsonwebtokens)

### Database
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=flat&logo=mongodb)

---

## ✨ Features

### 👤 User Side
- **Authentication** — Register, login with JWT, Remember Me (30 day session)
- **Services** — Browse all event services with images, pricing and details
- **Service Detail** — View full service info before booking
- **Booking System** — Select from admin-defined available dates and time slots
- **Payment** — Secure card payment form with masked card storage
- **Booking Confirmation** — Receipt page with downloadable confirmation
- **Booking History** — View all personal bookings split into upcoming and past with status badges

### 🔐 Admin Side
- **Dashboard** — Live stats: total bookings, pending, approved, revenue
- **Booking Oversight** — View all bookings, filter by status, search by user or service, approve or reject with automatic email to user
- **Service Management** — Add, edit, delete services with image URL support
- **Time Slot Management** — Add, edit, delete available dates and time slots per date
- **Email Notifications** — Automatic emails on payment, approval and rejection

---

## 🗂️ Project Structure

```
Planora/
├── Frontend/                   # React + Vite
│   ├── src/
│   │   ├── api.js              # All API calls centralised
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Signup.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── UserServices.jsx
│   │   │   ├── UserBookings.jsx
│   │   │   ├── EventDetail.jsx
│   │   │   ├── BookingForm.jsx
│   │   │   ├── PaymentPage.jsx
│   │   │   ├── BookingConfirmation.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── AdminBookings.jsx
│   │   │   ├── AdminServices.jsx
│   │   │   └── AdminTimeSlots.jsx
│   │   ├── components/
│   │   │   ├── LoginComponents/
│   │   │   ├── SignupComponents/
│   │   │   ├── UserComponents/
│   │   │   └── AdminComponents/
│   │   └── config/
│   │       └── routes.jsx
│   ├── vite.config.js
│   └── package.json
│
└── Backend/                    # Python + Flask
    ├── app.py
    ├── config.py
    ├── extensions.py
    ├── requirements.txt
    ├── .env
    ├── models/
    │   ├── user_model.py
    │   └── service_model.py
    └── routes/
        ├── auth_routes.py
        ├── service_routes.py
        ├── booking_routes.py
        └── payment_routes.py
```

---

## 🗄️ Database Design

**MongoDB Atlas — `planora_db`**

| Collection | Purpose |
|---|---|
| `users` | Stores registered users with hashed passwords and roles |
| `services` | Event services with title, category, price, duration, image |
| `bookings` | All booking records with status and payment tracking |
| `payments` | Payment records with transaction IDs |
| `timeslots` | Admin-defined available dates and time slots |

### Key Relationships
- `bookings.service_id` references `services._id`
- `bookings.user_email` references `users.email`
- `payments.booking_id` references `bookings._id`

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- Python 3.10+
- MongoDB Atlas account

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/planora.git](https://github.com/ritaj-suleman/Planora-EventPlanningApp-FReMP-.git
```

### 2. Backend Setup
```bash
cd Backend
python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

Create a `.env` file in the Backend folder:
```
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET_KEY=your_secret_key
MAIL_USERNAME=your_gmail@gmail.com
MAIL_PASSWORD=your_gmail_app_password
```

Start the backend:
```bash
python app.py
```
Backend runs on **http://localhost:5000**

### 3. Frontend Setup
```bash
cd Frontend
npm install
npm run dev
```
Frontend runs on **http://localhost:5173**

### 4. Open in browser
```
http://localhost:5173
```

---

## 🔑 Environment Variables

| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB Atlas connection string |
| `JWT_SECRET_KEY` | Secret key for JWT token generation |
| `MAIL_USERNAME` | Gmail address for sending emails |
| `MAIL_PASSWORD` | Gmail app password (not regular password) |

> To get a Gmail app password: Google Account → Security → 2-Step Verification → App Passwords

---

## 📡 API Routes

### Auth
| Method | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login and get JWT token |

### Services
| Method | Route | Description |
|---|---|---|
| GET | `/api/services/` | Get all services |
| GET | `/api/services/<id>` | Get single service |
| POST | `/api/services/add` | Add service (admin) |
| PUT | `/api/services/edit/<id>` | Edit service (admin) |
| DELETE | `/api/services/delete/<id>` | Delete service (admin) |

### Bookings
| Method | Route | Description |
|---|---|---|
| POST | `/api/bookings/create` | Create booking (user) |
| GET | `/api/bookings/my` | Get own bookings (user) |
| GET | `/api/bookings/all` | Get all bookings (admin) |
| GET | `/api/bookings/stats` | Get booking statistics (admin) |
| GET | `/api/bookings/<id>` | Get single booking |
| PUT | `/api/bookings/approve/<id>` | Approve booking (admin) |
| PUT | `/api/bookings/reject/<id>` | Reject booking (admin) |
| PUT | `/api/bookings/cancel/<id>` | Cancel booking |

### Payments
| Method | Route | Description |
|---|---|---|
| POST | `/api/payments/create` | Process payment (user) |

### Time Slots
| Method | Route | Description |
|---|---|---|
| GET | `/api/timeslots/available` | Get active slots (user) |
| GET | `/api/timeslots/all` | Get all slots (admin) |
| POST | `/api/timeslots/add` | Add time slot (admin) |
| PUT | `/api/timeslots/edit/<id>` | Edit time slot (admin) |
| DELETE | `/api/timeslots/delete/<id>` | Delete time slot (admin) |

---

## 🔄 User Flow

```
Register / Login
      ↓
Browse Services
      ↓
View Service Detail
      ↓
Select Date & Time Slot
      ↓
Fill Booking Form
      ↓
Enter Card Details & Pay
      ↓
Booking Confirmation (Under Review)
      ↓
Admin Reviews & Approves
      ↓
User Receives Confirmation Email
```

---

## 🛡️ Security

- Passwords hashed with **bcrypt** — never stored as plain text
- Authentication via **JWT tokens** — stateless and secure
- Card numbers **never stored** — only last 4 digits saved
- CVV and expiry date **never stored** in database
- Admin routes protected with **role-based JWT verification**
- Remember Me uses **30 day token expiry**, session only uses **24 hour expiry**

---

## 📦 Dependencies

### Backend
```
Flask==3.1.3
Flask-PyMongo==3.0.1
Flask-JWT-Extended==4.7.1
Flask-Bcrypt==1.0.1
Flask-Mail==0.9.1
flask-cors==6.0.2
python-dotenv==1.2.2
pymongo==4.16.0
```

### Frontend
```
react
react-dom
react-router-dom
vite
```

---

## 👥 Team

| Role | Responsibility |
|---|---|
| Frontend Developer | React UI, pages, components, API integration |
| Backend Developer | Flask API, routes, JWT, email, MongoDB queries |
| Database Designer | MongoDB Atlas setup, collections, indexes, schema design |

---

## 📋 Development Iterations

**Iteration 1 — Core Platform**
User authentication, services display, admin dashboard foundation

**Iteration 2 — Booking & Payment**
Full booking system, payment processing, admin approve/reject, email notifications

**Iteration 3 — Management & History**
Service management, time slot management, booking history, booking oversight, remember me

---

## 📄 License

This project was developed as a university project for educational purposes.

---

<div align="center">
  Made with ❤️ using React, Flask and MongoDB
</div>
