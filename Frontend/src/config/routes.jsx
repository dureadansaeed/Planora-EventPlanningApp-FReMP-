import { createBrowserRouter } from "react-router-dom";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import UserDashboard from "../pages/UserDashboard";
import UserServices from "../pages/UserServices";
import UserBookings from "../pages/UserBookings";
import BookingForm from "../pages/BookingForm";
import PaymentPage from "../pages/PaymentPage";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminEvents from "../pages/AdminEvents";
import AdminReports from "../pages/AdminReports";
import AdminSettings from "../pages/AdminSettings";
import AdminBookings from "../pages/AdminBookings";
import AdminServices from "../pages/AdminServices";
import AdminTimeSlots from "../pages/AdminTimeSlots";
import BookingConfirmation from "../pages/BookingConfirmation";
import EventDetail from "../pages/EventDetail";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/admin/bookings",
    element: <AdminBookings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/user-dashboard",
    element: <UserDashboard />,
  },
  {
    path: "/user/bookings",
    element: <UserBookings />,
  },
  {
    path: "/user/services",
    element: <UserServices />,
  },
  {
    path: "/book/:serviceId",
    element: <BookingForm />,
  },
  {
    path: "/service/:serviceId",
    element: <EventDetail />,
  },
  {
    path: "/book/:serviceId/payment",
    element: <PaymentPage />,
  },
  {
    path: "/admin-dashboard",
    element: <AdminDashboard />,
  },
  {
    path: "/admin/services",
    element: <AdminServices />,
  },
  {
    path: "/admin/time-slots",
    element: <AdminTimeSlots />,
  },
  {
    path: "/admin/users",
    element: <AdminUsers />,
  },
  {
    path: "/admin/events",
    element: <AdminEvents />,
  },
  {
    path: "/admin/reports",
    element: <AdminReports />,
  },
  {
    path: "/admin/settings",
    element: <AdminSettings />,
  },
  {
    path: "/booking/confirmed",
    element: <BookingConfirmation />,
  },
]);
