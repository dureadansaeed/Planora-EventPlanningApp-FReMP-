import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { getBooking } from "../api";

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const initial = location.state?.booking || null;
  const isAdminView = location.state?.viewer === "admin";
  const [booking, setBooking] = useState(initial);

  useEffect(() => {
    const id = booking?.booking_id || (initial && initial.booking_id) || null;
    if ((!booking || !booking.service) && id) {
      const rawId = id.toString().startsWith("#") ? id.toString().slice(1) : id;
      getBooking(rawId)
        .then((data) => setBooking(data))
        .catch((e) => console.error("Failed to fetch booking details", e));
    }
  }, [booking, initial]);

  const display = booking || {
    booking_id: "BK72414951",
    service: { title: "Service Booking", description: "Event services coordinated by Planora" },
    event_date: "Pending Date",
    event_time: "Pending Time",
    payment_status: "paid",
    status: "approved",
    total_amount: "$0",
    transaction_id: "TXN-PENDING",
    masked_card: ".... .... .... 0000",
  };

  const headerTitle = isAdminView ? "Booking Receipt" : "Booking Confirmed!";
  const headerSubtitle = isAdminView ? "Admin view of this booking record." : "Booking under review.";
  const headerChip = isAdminView
    ? `Status: ${(display.status || "pending").toUpperCase()}`
    : "Confirmation sent to your registered email";
  const receiptTitle = isAdminView ? "Booking Receipt" : "Official Receipt";
  const downloadTitle = isAdminView ? "planora-admin-receipt" : "planora-receipt";
  const footerLineOne = isAdminView
    ? "Admin copy of the Planora booking receipt."
    : "Thank you for choosing Planora for your special events.";
  const footerLineTwo = isAdminView
    ? "For internal booking reference only."
    : "An official tax receipt has been emailed to you.";
  const totalLabel = (display.payment_status || "").toLowerCase() === "paid" ? "Total Paid" : "Booking Total";
  const serviceTitle = display.service?.title || (display.service_deleted ? "Service no longer available" : "Event Service");
  const serviceDescription = display.service?.description || (display.service_deleted ? "This service has been removed from the public catalog." : "Event services coordinated by Planora");

  const createAndDownload = () => {
    const html = `
      <html><head><meta charset="utf-8">
      <style>
        body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #333; max-width: 600px; margin: 40px auto; line-height: 1.6; }
        .header { text-align: center; border-bottom: 2px solid #ffb6c1; padding-bottom: 20px; margin-bottom: 30px; }
        .header h1 { color: #ff6f98; margin: 0; font-size: 28px; }
        .detail-row { display: flex; justify-content: space-between; margin-bottom: 12px; border-bottom: 1px dotted #eee; padding-bottom: 8px; }
        .label { color: #888; text-transform: uppercase; font-size: 12px; letter-spacing: 1px; }
        .value { font-weight: bold; }
        .total { font-size: 24px; color: #ff6f98; margin-top: 20px; text-align: right; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #aaa; }
      </style>
      </head><body>
      <div class="header">
        <h1>Planora</h1>
        <p>${receiptTitle}</p>
      </div>
      <div>
        <div class="detail-row"><span class="label">Booking ID</span><span class="value">#${display.booking_id}</span></div>
        <div class="detail-row"><span class="label">Service</span><span class="value">${serviceTitle}</span></div>
        <div class="detail-row"><span class="label">Event Date</span><span class="value">${display.event_date}</span></div>
        <div class="detail-row"><span class="label">Event Time</span><span class="value">${display.event_time}</span></div>
        <div class="detail-row"><span class="label">Status</span><span class="value">${(display.status || "pending").toUpperCase()}</span></div>
        <div class="detail-row"><span class="label">Payment</span><span class="value">${(display.payment_status || "unpaid").toUpperCase()} (${display.masked_card || display.transaction_id || "N/A"})</span></div>
      </div>
      <div class="total">${totalLabel}: ${display.total_amount}</div>
      <div class="footer">${footerLineOne}<br>${footerLineTwo}</div>
      </body></html>
    `;
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${downloadTitle}-${display.booking_id}.html`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ minHeight: "100vh", padding: "60px 24px", fontFamily: "'Poppins', sans-serif", background: "linear-gradient(180deg,#ffeef3,#f7f1ff)" }}>
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ background: "white", borderRadius: 16, padding: "40px", textAlign: "center", boxShadow: "0 8px 30px rgba(0,0,0,0.08)", marginBottom: 24 }}>
          <div style={{ width: 80, height: 80, borderRadius: 40, background: "linear-gradient(135deg,#ff9dbf,#f7c7dc)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "white", fontSize: 36, marginBottom: 16, boxShadow: "0 4px 15px rgba(255,157,191,0.4)" }}>
            R
          </div>
          <h1 style={{ margin: "0 0 8px 0", color: "#4a4a4a", fontFamily: "'Abril Fatface', serif", fontSize: 32 }}>{headerTitle}</h1>
          <p style={{ margin: 0, color: "#777", fontSize: 16 }}>{headerSubtitle}</p>
          <div style={{ marginTop: 12, padding: "8px 16px", background: "#fff0f5", borderRadius: 20, display: "inline-block", fontSize: 13, color: "#ff6f98", fontWeight: 600 }}>
            {headerChip}
          </div>
        </div>

        <div style={{ background: "white", borderRadius: 16, padding: 32, boxShadow: "0 8px 30px rgba(0,0,0,0.05)", marginBottom: 24, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 6, background: "linear-gradient(90deg,#ffb6c1,#f7c7dc)" }} />

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderBottom: "1px solid #f0f0f0", paddingBottom: 20, marginBottom: 24 }}>
            <div>
              <h3 style={{ margin: 0, fontSize: 20, color: "#4a4a4a" }}>{receiptTitle}</h3>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600 }}>Booking ID</div>
              <div style={{ color: "#ff6f98", fontWeight: 800, fontSize: 18 }}>#{display.booking_id}</div>
            </div>
          </div>

          <div style={{ display: "flex", gap: 24, marginBottom: 24 }}>
            <div style={{ flex: 2 }}>
              <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 8 }}>Service Booked</div>
              <div style={{ background: "#fcfcfa", padding: 16, borderRadius: 12, border: "1px solid #f0f0f0" }}>
                <strong style={{ fontSize: 16, color: "#4a4a4a" }}>{serviceTitle}</strong>
                <div style={{ marginTop: 4, color: "#888", fontSize: 13, lineHeight: 1.5 }}>{serviceDescription}</div>
              </div>
            </div>

            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>Date</div>
                <div style={{ color: "#4a4a4a", fontWeight: 600 }}>{display.event_date}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>Time</div>
                <div style={{ color: "#4a4a4a", fontWeight: 600 }}>{display.event_time}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: "#aaa", textTransform: "uppercase", letterSpacing: 1, fontWeight: 600, marginBottom: 4 }}>Status</div>
                <div style={{ color: "#4a4a4a", fontWeight: 600, textTransform: "capitalize" }}>{display.status || "pending"}</div>
              </div>
            </div>
          </div>

          <div style={{ background: "#fff6f9", padding: 20, borderRadius: 12, border: "1px dashed #ffb6c1" }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#ff6f98", marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>Payment Summary</div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
              <span>Base Service Fee</span>
              <span style={{ fontWeight: 600 }}>{display.total_amount}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, color: "#666" }}>
              <span>Payment Status</span>
              <span style={{ fontWeight: 600, textTransform: "uppercase" }}>{display.payment_status || "unpaid"}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16, color: "#888", fontSize: 14 }}>
              <span>Taxes & Fees</span>
              <span>$0.00</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #ffd6e6", paddingTop: 16, fontSize: 24, fontWeight: 800, color: "#4a4a4a" }}>
              <span>{totalLabel}</span>
              <span style={{ color: "#ff6f98" }}>{display.total_amount}</span>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, background: "#fff", padding: "10px 14px", borderRadius: 8 }}>
              <div style={{ color: "#0a8f54", fontWeight: 700, fontSize: 13 }}>
                {isAdminView ? "Internal payment reference" : "Securely Paid via Card"}
              </div>
              <div style={{ color: "#aaa", fontSize: 12, fontFamily: "monospace" }}>{display.masked_card || display.transaction_id || "N/A"}</div>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 16 }}>
          <button
            onClick={() => navigate(isAdminView ? "/admin/bookings" : "/user-dashboard")}
            style={{ flex: 1, background: "linear-gradient(135deg,#ff9dbf,#f7c7dc)", color: "white", padding: "16px", borderRadius: 30, border: "none", cursor: "pointer", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, boxShadow: "0 4px 15px rgba(255,157,191,0.4)", transition: "0.2s" }}
          >
            {isAdminView ? "Back to Admin Bookings" : "Go to My Dashboard"}
          </button>
          <button
            onClick={createAndDownload}
            style={{ flex: 1, background: "white", color: "#ff6f98", padding: "16px", borderRadius: 30, border: "2px solid #ffd6e6", cursor: "pointer", fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, transition: "0.2s" }}
          >
            Download Receipt
          </button>
        </div>
      </div>
    </div>
  );
}
