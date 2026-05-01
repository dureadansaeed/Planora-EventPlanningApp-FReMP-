import React, { useEffect, useState } from "react";
import { approveBooking, fetchAllBookings, rejectBooking } from "../../api";
import "../../styles/Admin.css";

function parseAmount(amount) {
  const cleaned = String(amount || "0").replace(/[$,]/g, "");
  return Number.parseFloat(cleaned) || 0;
}

export default function AdminDashboardContent() {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({ revenue: 0, total: 0, confirmed: 0, pending: 0 });
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadBookings();
  }, []);

  async function loadBookings() {
    try {
      setErrorMessage("");
      const data = await fetchAllBookings();
      if (!Array.isArray(data)) {
        setBookings([]);
        setStats({ revenue: 0, total: 0, confirmed: 0, pending: 0 });
        return;
      }

      const valid = data
        .filter((booking) => booking.event_date)
        .sort((a, b) => new Date(b.created_at || b.event_date) - new Date(a.created_at || a.event_date));

      const confirmed = valid.filter((booking) => (booking.status || "").toLowerCase() === "approved").length;
      const pending = valid.filter((booking) => !booking.status || (booking.status || "").toLowerCase() === "pending").length;
      const revenue = valid.reduce((sum, booking) => {
        return (booking.payment_status || "").toLowerCase() === "paid" ? sum + parseAmount(booking.total_amount) : sum;
      }, 0);

      setStats({ revenue, total: valid.length, confirmed, pending });
      setBookings(valid.slice(0, 5));
    } catch (e) {
      console.error("Failed fetching dashboard stats", e);
      setBookings([]);
      setStats({ revenue: 0, total: 0, confirmed: 0, pending: 0 });
      setErrorMessage(e.message || "Failed to load bookings");
    }
  }

  async function updateStatus(id, action) {
    try {
      setErrorMessage("");
      await (action === "approve" ? approveBooking(id) : rejectBooking(id));
      await loadBookings();
    } catch (e) {
      console.error(e);
      setErrorMessage(e.message || "Failed to update booking");
      alert(e.message || "Failed to update booking");
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20, paddingBottom: 40 }}>
      <div className="admin-grid-2">
        <MetricCard label="Total Revenue" value={`$${stats.revenue.toLocaleString()}`} accent="#FFB6C1" />
        <MetricCard label="Total Bookings" value={stats.total} accent="#D4B5E5" />
        <MetricCard label="Confirmed" value={stats.confirmed} accent="#52C77A" />
        <MetricCard label="Pending" value={stats.pending} accent="#FFD180" />
      </div>

      <div
        style={{
          background: "rgba(255,255,255,0.95)",
          borderRadius: 16,
          padding: 18,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,182,193,0.2)",
          marginTop: 8,
        }}
      >
        <h3
          style={{
            fontSize: 18,
            fontWeight: 600,
            color: "#2A2A2A",
            margin: "0 0 16px 0",
            fontFamily: "'Arimo', sans-serif",
          }}
        >
          Recent Bookings
        </h3>

        {errorMessage && (
          <div style={{ marginBottom: 12, color: "#d64545", fontSize: 13, fontWeight: 600 }}>
            {errorMessage}
          </div>
        )}

        {bookings.length === 0 && <div style={{ color: "#aaa", fontSize: 13, fontStyle: "italic" }}>No bookings available.</div>}

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {bookings.map((booking, index) => (
            <div
              key={booking.booking_id || index}
              style={{
                background: "#F8F5FA",
                borderRadius: 10,
                padding: 14,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 12,
                border: "1px solid rgba(200,200,220,0.1)",
              }}
            >
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#2A2A2A", marginBottom: 3, fontFamily: "'Arimo', sans-serif" }}>
                  {booking.service?.title || "Custom Event"}
                </div>
                <div style={{ fontSize: 11, color: "#8A8A8A", fontFamily: "'Arimo', sans-serif" }}>
                  {booking.event_date} at {booking.event_time}
                </div>
                <div style={{ fontSize: 11, color: "#8A8A8A", fontFamily: "'Arimo', sans-serif", marginTop: 4 }}>
                  {booking.user_name || booking.user_email || "Unknown user"}
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#FF6F98", fontFamily: "'Arimo', sans-serif" }}>
                  {booking.total_amount || "-"}
                </div>
                <span
                  style={{
                    padding: "3px 10px",
                    borderRadius: 6,
                    fontSize: 10,
                    fontWeight: 600,
                    background:
                      booking.status === "approved"
                        ? "#E8F8F0"
                        : booking.status === "rejected" || booking.status === "cancelled"
                        ? "#FFEBEE"
                        : "#FFFAEE",
                    color:
                      booking.status === "approved"
                        ? "#52C77A"
                        : booking.status === "rejected" || booking.status === "cancelled"
                        ? "#FF5A5F"
                        : "#FFB366",
                    textTransform: "capitalize",
                    fontFamily: "'Arimo', sans-serif",
                  }}
                >
                  {booking.status || "pending"}
                </span>

                {(booking.status === "pending" || !booking.status) && (
                  <div style={{ display: "flex", gap: 6 }}>
                    <button
                      onClick={() => updateStatus(booking.booking_id, "approve")}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "none",
                        background: "#E8F8F0",
                        color: "#0BB57A",
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => updateStatus(booking.booking_id, "reject")}
                      style={{
                        padding: "4px 8px",
                        borderRadius: 6,
                        border: "none",
                        background: "#FFEBEE",
                        color: "#FF5A5F",
                        fontSize: 10,
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MetricCard({ label, value, accent }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        borderRadius: 16,
        padding: 18,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
        border: "1px solid rgba(255,182,193,0.2)",
      }}
    >
      <div style={{ fontSize: 12, color: "#8A8A8A", fontFamily: "'Arimo', sans-serif", marginBottom: 6 }}>{label}</div>
      <div style={{ fontSize: 28, fontWeight: 700, color: accent, fontFamily: "'Arimo', sans-serif" }}>{value}</div>
    </div>
  );
}
