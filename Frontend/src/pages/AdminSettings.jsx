import React, { useState } from 'react';
import AdminLayout from "../components/AdminComponents/AdminLayout";

const styles = {
  container: { background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 30, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.1)", border: "1px solid rgba(213,185,229,0.1)", maxWidth: "800px" },
  title: { color: "#4A4A4A", fontSize: 28, margin: "0 0 20px 0", fontWeight: 600, fontFamily: "'Abril Fatface', serif" },
  formGroup: { marginBottom: "20px", display: "flex", flexDirection: "column", gap: "8px" },
  label: { fontSize: "14px", fontWeight: "bold", color: "#666", textTransform: "uppercase", letterSpacing: "1px" },
  input: { padding: "12px", borderRadius: "8px", border: "1px solid #FFE4E8", outline: "none", fontSize: "15px", color: "#333", background: "#FFF" },
  btnPrimary: { background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)", color: "white", padding: "12px 24px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", transition: "0.2s", marginTop: "10px" },
  sectionTitle: { fontSize: "18px", color: "#FF6F91", margin: "30px 0 15px 0", borderBottom: "1px solid #FFE4E8", paddingBottom: "10px", fontWeight: "bold" }
};

export default function AdminSettings() {
  const [profile, setProfile] = useState({ name: "Planora Admin", email: "admin@planora.com", phone: "+92 51 1234567" });
  const [password, setPassword] = useState({ current: "", new: "", confirm: "" });
  const [notifications, setNotifications] = useState(true);

  const handleSaveProfile = (e) => {
    e.preventDefault();
    alert("Profile settings saved successfully!");
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    setPassword({ current: "", new: "", confirm: "" });
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Platform Settings</h1>
        
        <h2 style={styles.sectionTitle}>Profile Details</h2>
        <form onSubmit={handleSaveProfile}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Name</label>
            <input type="text" value={profile.name} onChange={(e) => setProfile({...profile, name: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Admin Email</label>
            <input type="email" value={profile.email} onChange={(e) => setProfile({...profile, email: e.target.value})} style={styles.input} />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Support Phone</label>
            <input type="text" value={profile.phone} onChange={(e) => setProfile({...profile, phone: e.target.value})} style={styles.input} />
          </div>
          <button type="submit" style={styles.btnPrimary}>Save Profile</button>
        </form>

        <h2 style={styles.sectionTitle}>Security</h2>
        <form onSubmit={handleChangePassword}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Current Password</label>
            <input type="password" value={password.current} onChange={(e) => setPassword({...password, current: e.target.value})} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>New Password</label>
            <input type="password" value={password.new} onChange={(e) => setPassword({...password, new: e.target.value})} style={styles.input} required />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Confirm New Password</label>
            <input type="password" value={password.confirm} onChange={(e) => setPassword({...password, confirm: e.target.value})} style={styles.input} required />
          </div>
          <button type="submit" style={styles.btnPrimary}>Update Password</button>
        </form>

        <h2 style={styles.sectionTitle}>Preferences</h2>
        <div style={{...styles.formGroup, flexDirection: "row", alignItems: "center"}}>
          <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} id="notifCheck" style={{ width: "20px", height: "20px", cursor: "pointer" }} />
          <label htmlFor="notifCheck" style={{ fontSize: "15px", color: "#333", cursor: "pointer" }}>Enable Email Notifications for New Bookings</label>
        </div>
      </div>
    </AdminLayout>
  );
}