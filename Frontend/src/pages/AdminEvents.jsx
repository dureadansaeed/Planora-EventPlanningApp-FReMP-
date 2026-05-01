import React, { useState } from 'react';
import AdminLayout from "../components/AdminComponents/AdminLayout";

const styles = {
  container: { background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 30, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.1)", border: "1px solid rgba(213,185,229,0.1)" },
  title: { color: "#4A4A4A", fontSize: 28, margin: "0 0 20px 0", fontWeight: 600, fontFamily: "'Abril Fatface', serif" },
  btnPrimary: { background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", transition: "0.2s" },
  btnDanger: { background: "#FFF0F5", color: "#FF6F91", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  th: { padding: "12px", borderBottom: "2px solid #FFE4E8", color: "#666", textAlign: "left", fontSize: "14px", textTransform: "uppercase" },
  td: { padding: "12px", borderBottom: "1px solid #FFF0F5", color: "#444" }
};

export default function AdminEvents() {
  const [events, setEvents] = useState([
    { id: 1, name: "Summer Gala 2026", type: "Corporate", attendees: 150, status: "Upcoming" },
    { id: 2, name: "Smith Wedding", type: "Wedding", attendees: 200, status: "Planning" },
    { id: 3, name: "City Tech Expo", type: "Exhibition", attendees: 500, status: "Ongoing" },
    { id: 4, name: "Johnson Anniversary", type: "Personal", attendees: 50, status: "Completed" }
  ]);

  const [newEvent, setNewEvent] = useState("");

  const handleAdd = (e) => {
    e.preventDefault();
    if (!newEvent) return;
    setEvents([...events, { id: Date.now(), name: newEvent, type: "Unknown", attendees: 0, status: "Draft" }]);
    setNewEvent("");
  };

  const handleDelete = (id) => {
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={styles.title}>Manage Events</h1>
          <form onSubmit={handleAdd} style={{ display: "flex", gap: "10px" }}>
            <input 
              type="text" 
              placeholder="New event name..." 
              value={newEvent} 
              onChange={(e) => setNewEvent(e.target.value)} 
              style={{ padding: "10px", borderRadius: "8px", border: "1px solid #FFE4E8", outline: "none" }}
            />
            <button type="submit" style={styles.btnPrimary}>+ Add Event</button>
          </form>
        </div>

        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Event Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>Attendees</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.map((evt) => (
              <tr key={evt.id}>
                <td style={styles.td}><strong>{evt.name}</strong></td>
                <td style={styles.td}>{evt.type}</td>
                <td style={styles.td}>{evt.attendees}</td>
                <td style={styles.td}>
                  <span style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", background: evt.status === "Completed" ? "#E8F5E9" : "#FFF5F7", color: evt.status === "Completed" ? "#2E7D32" : "#FF6F91" }}>
                    {evt.status}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button onClick={() => handleDelete(evt.id)} style={styles.btnDanger}>Cancel</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}