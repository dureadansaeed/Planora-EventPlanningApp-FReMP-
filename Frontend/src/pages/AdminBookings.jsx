import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "../components/AdminComponents/AdminLayout";
import { approveBooking, fetchAllBookings, rejectBooking } from "../api";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/login");
      return;
    }
    loadBookings();
  }, [navigate]);

  async function loadBookings() {
    setLoading(true);
    try {
      setErrorMessage("");
      const data = await fetchAllBookings();
      if (Array.isArray(data)) {
        const valid = data
          .filter((booking) => booking.event_date)
          .sort((a, b) => new Date(b.created_at || b.event_date) - new Date(a.created_at || a.event_date));
        setBookings(valid);
      } else {
        setBookings([]);
      }
    } catch (e) {
      console.error(e);
      setBookings([]);
      setErrorMessage(e.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    let out = [...bookings];
    if (statusFilter !== "all") out = out.filter((b) => (b.status || "").toLowerCase() === statusFilter);
    if (paymentFilter !== "all") out = out.filter((b) => (b.payment_status || "").toLowerCase() === paymentFilter);
    if (search.trim()) {
      const q = search.toLowerCase();
      out = out.filter(
        (b) =>
          (b.booking_id || "").toLowerCase().includes(q) ||
          (b.service?.title || "").toLowerCase().includes(q) ||
          (b.user_name || "").toLowerCase().includes(q) ||
          (b.user_email || "").toLowerCase().includes(q) ||
          (b.event_date || "").toLowerCase().includes(q) ||
          (b.event_time || "").toLowerCase().includes(q) ||
          (b.contact_number || "").toLowerCase().includes(q)
      );
    }
    return out;
  }, [bookings, statusFilter, paymentFilter, search]);

  async function handleAction(id, action) {
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

  function exportCSV() {
    if (!filtered.length) return;
    const rows = filtered.map((b) => ({
      booking_id: b.booking_id || b._id || "",
      user: b.user_name || b.user_email || "",
      service: b.service?.title || "",
      date: b.event_date || "",
      time: b.event_time || "",
      status: b.status || "",
      payment: b.payment_status || "",
      total: b.total_amount || "",
    }));
    const keys = Object.keys(rows[0]);
    const csv = [keys.join(","), ...rows.map((row) => keys.map((key) => `"${row[key] || ""}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "planora_bookings.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
            flexWrap: "wrap",
            background: "#fff",
            padding: 24,
            borderRadius: 16,
            boxShadow: "0 8px 30px rgba(0,0,0,0.06)",
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, color: "#4a4a4a", margin: 0, fontFamily: "'Abril Fatface', serif" }}>All Bookings</h1>
            <div style={{ color: "#888", marginTop: 6 }}>Live booking records from the database</div>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <select style={inputStyle} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="all">Any Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </select>
            <select style={inputStyle} value={paymentFilter} onChange={(e) => setPaymentFilter(e.target.value)}>
              <option value="all">Any Payment</option>
              <option value="unpaid">Unpaid</option>
              <option value="paid">Paid</option>
              <option value="refunded">Refunded</option>
            </select>
            <input
              placeholder="Search booking, service, user..."
              style={{ ...inputStyle, width: 240 }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              onClick={exportCSV}
              style={{ border: "none", borderRadius: 10, padding: "10px 18px", background: "linear-gradient(135deg,#ff9dbf,#f7c7dc)", color: "#fff", fontWeight: 700, cursor: "pointer" }}
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading && <div style={{ textAlign: "center", padding: 40, color: "#ff9dbf", fontWeight: 700 }}>Loading bookings...</div>}
        {!loading && errorMessage && <div style={{ ...emptyStyle, color: "#d64545", fontStyle: "normal" }}>{errorMessage}</div>}
        {!loading && filtered.length === 0 && <div style={emptyStyle}>No bookings found for the current filters.</div>}

        {filtered.map((booking) => (
          <div
            key={booking._id || booking.booking_id}
            style={{
              background: "#fff",
              padding: 24,
              borderRadius: 16,
              boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
              border: "1px solid #ffd6e6",
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 800, color: "#4a4a4a", fontSize: 18 }}>{booking.service?.title || "Event Service"}</div>
                <span style={badgeStyle(booking.status)}>{booking.status || "pending"}</span>
              </div>
              <div style={{ color: "#888", fontSize: 12, marginTop: 4, fontFamily: "monospace" }}>REF: #{booking.booking_id || booking._id}</div>
              <div style={{ color: "#666", fontSize: 13, marginTop: 10, display: "flex", gap: 12, flexWrap: "wrap" }}>
                <span><b>Date:</b> {booking.event_date}</span>
                <span><b>Time:</b> {booking.event_time}</span>
                <span><b>User:</b> {booking.user_name || booking.user_email || "N/A"}</span>
                <span><b>Contact:</b> {booking.contact_number || "N/A"}</span>
              </div>
              {booking.event_location && <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}><b>Location:</b> {booking.event_location}</div>}
              {booking.event_theme && <div style={{ color: "#666", fontSize: 13, marginTop: 6 }}><b>Theme:</b> {booking.event_theme}</div>}
            </div>

            <div style={{ minWidth: 220, textAlign: "right" }}>
              <div style={{ fontWeight: 800, color: "#ff6f98", fontSize: 22 }}>{booking.total_amount || ""}</div>
              <div
                style={{
                  color: booking.payment_status === "paid" ? "#0bb57a" : booking.payment_status === "refunded" ? "#888" : "#aaa",
                  fontSize: 12,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  margin: "4px 0 16px 0",
                }}
              >
                {booking.payment_status || "unpaid"}
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
                {(booking.status === "pending" || !booking.status) && (
                  <>
                    <button onClick={() => handleAction(booking.booking_id, "approve")} style={successButtonStyle}>Accept</button>
                    <button onClick={() => handleAction(booking.booking_id, "reject")} style={dangerButtonStyle}>Reject</button>
                  </>
                )}
                <button onClick={() => navigate("/booking/confirmed", { state: { booking, viewer: "admin" } })} style={outlineButtonStyle}>
                  Receipt
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}

const inputStyle = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ffd6e6",
  background: "#fff5f7",
  color: "#4a4a4a",
};

const emptyStyle = {
  padding: 24,
  background: "#fff",
  borderRadius: 16,
  color: "#aaa",
  fontStyle: "italic",
};

const successButtonStyle = {
  padding: "8px 16px",
  borderRadius: 24,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  background: "#0bb57a",
  color: "#fff",
};

const dangerButtonStyle = {
  padding: "8px 16px",
  borderRadius: 24,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  background: "#ff5a5f",
  color: "#fff",
};

const outlineButtonStyle = {
  padding: "8px 16px",
  borderRadius: 24,
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 13,
  background: "#fff5f7",
  color: "#ff6f98",
  border: "2px solid #ffd6e6",
};

function badgeStyle(status) {
  const value = (status || "").toLowerCase();
  let background = "#eee";
  let color = "#555";

  if (value === "pending") {
    background = "#fffce0";
    color = "#b58500";
  } else if (value === "approved") {
    background = "#e8f8f0";
    color = "#0bb57a";
  } else if (value === "rejected" || value === "cancelled") {
    background = "#ffebee";
    color = "#ff5a5f";
  }

  return {
    padding: "6px 12px",
    borderRadius: 20,
    background,
    color,
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: 1,
  };
}
