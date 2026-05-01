import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyBookings } from "../../api";
import "../../styles/UserStyles.css";

function getLatestBooking(bookings) {
  if (!Array.isArray(bookings) || bookings.length === 0) return null;
  return [...bookings].sort((a, b) => new Date(b.created_at || b.event_date) - new Date(a.created_at || a.event_date))[0];
}

export default function UserPhotographySection() {
  const navigate = useNavigate();
  const [latestBooking, setLatestBooking] = useState(null);

  useEffect(() => {
    fetchMyBookings()
      .then((data) => {
        if (Array.isArray(data)) {
          setLatestBooking(getLatestBooking(data));
        }
      })
      .catch((e) => console.error("Failed to load latest booking", e));
  }, []);

  const booking = latestBooking;
  const title = booking?.service?.title || "No recent bookings yet";
  const date = booking?.event_date || "Pick a service to get started";
  const time = booking?.event_time || "Select date and time later";
  const status = booking?.status || "Browse Services";

  return (
    <div className="user-section-padding" style={{ background: "#FFF5F7", marginBottom: 0 }}>
      <div
        style={{
          background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)",
          borderRadius: 20,
          padding: 32,
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
        }}
      >
        <div style={{ flex: 1 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 1,
              marginBottom: 12,
              opacity: 0.9,
              fontFamily: "'Arimo', sans-serif",
            }}
          >
            {booking ? "LATEST BOOKING" : "BOOK EVENTS"}
          </div>

          <h2
            style={{
              fontSize: 32,
              fontWeight: 700,
              margin: "0 0 16px 0",
              fontFamily: "'Arimo', sans-serif",
            }}
          >
            {title}
          </h2>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              marginBottom: 20,
              fontSize: 14,
              fontFamily: "'Arimo', sans-serif",
              flexWrap: "wrap",
            }}
          >
            <span>Date: {date}</span>
            <span>Time: {time}</span>
          </div>

          <button
            onClick={() => navigate(booking ? "/user/bookings" : "/user/services")}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background: "rgba(255,255,255,0.25)",
              color: "white",
              fontSize: 12,
              fontWeight: 600,
              fontFamily: "'Arimo', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            {booking ? "View All Bookings" : "Browse Services"}
          </button>
        </div>

        <button
          onClick={() => navigate(booking ? "/user/bookings" : "/user/services")}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            background: "rgba(255,255,255,0.3)",
            color: "white",
            fontSize: 12,
            fontWeight: 600,
            fontFamily: "'Arimo', sans-serif",
            cursor: "pointer",
            transition: "all 0.2s",
            textTransform: "capitalize",
          }}
        >
          {status}
        </button>
      </div>
    </div>
  );
}
