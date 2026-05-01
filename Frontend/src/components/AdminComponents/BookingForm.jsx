import "../../styles/Admin.css";

export default function BookingForm() {
  return (
    <div style={{ padding: 16, borderRadius: 12, background: "#fff", boxShadow: "0 4px 12px rgba(0,0,0,0.04)", border: "1px solid rgba(0,0,0,0.04)" }}>
      <h3 style={{ marginTop: 0 }}>New Booking</h3>
      <form>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <input placeholder="Event name" style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
          <input type="date" style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
          <input type="time" style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }} />
          <select style={{ padding: 8, borderRadius: 6, border: "1px solid #e6e6e6" }}>
            <option>pending</option>
            <option>confirmed</option>
            <option>cancelled</option>
          </select>
          <button type="button" style={{ padding: "8px 12px", borderRadius: 8, background: "#FFB6C1", border: "none", fontWeight: 700 }}>Create</button>
        </div>
      </form>
    </div>
  );
}
