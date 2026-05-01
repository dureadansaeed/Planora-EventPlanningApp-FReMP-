import React, { useState } from 'react';
import AdminLayout from "../components/AdminComponents/AdminLayout";

const styles = {
  container: { background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 30, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.1)", border: "1px solid rgba(213,185,229,0.1)" },
  title: { color: "#4A4A4A", fontSize: 28, margin: "0 0 20px 0", fontWeight: 600, fontFamily: "'Abril Fatface', serif" },
  btnDanger: { background: "#FFF0F5", color: "#FF6F91", padding: "6px 12px", borderRadius: "6px", border: "none", cursor: "pointer", fontWeight: "bold" },
  table: { width: "100%", borderCollapse: "collapse", marginTop: "20px" },
  th: { padding: "12px", borderBottom: "2px solid #FFE4E8", color: "#666", textAlign: "left", fontSize: "14px", textTransform: "uppercase" },
  td: { padding: "12px", borderBottom: "1px solid #FFF0F5", color: "#444" }
};

export default function AdminUsers() {
  const [users, setUsers] = useState([
    { id: 101, name: "Ayesha Khan", email: "ayesha@gmail.com", role: "User", status: "Active" },
    { id: 102, name: "John Doe", email: "john@doe.com", role: "Manager", status: "Active" },
    { id: 103, name: "Emily Clark", email: "emily@clark.com", role: "User", status: "Inactive" },
    { id: 104, name: "Planora Admin", email: "admin@planora.com", role: "Admin", status: "Active" }
  ]);

  const toggleStatus = (id) => {
    setUsers(users.map(u => {
      if(u.id === id) {
        return { ...u, status: u.status === "Active" ? "Inactive" : "Active" };
      }
      return u;
    }));
  };

  const handleRemove = (id) => {
    setUsers(users.filter(u => u.id !== id));
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>System Users</h1>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Status</th>
              <th style={{ ...styles.th, textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td style={styles.td}><strong>{user.name}</strong></td>
                <td style={styles.td}>{user.email}</td>
                <td style={styles.td}>{user.role}</td>
                <td style={styles.td}>
                  <span onClick={() => toggleStatus(user.id)} style={{ padding: "4px 10px", borderRadius: "20px", fontSize: "12px", background: user.status === "Active" ? "#E8F5E9" : "#FFE0E0", color: user.status === "Active" ? "#2E7D32" : "#D32F2F", cursor: "pointer" }}>
                    {user.status}
                  </span>
                </td>
                <td style={{ ...styles.td, textAlign: 'right' }}>
                  <button onClick={() => handleRemove(user.id)} style={styles.btnDanger}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}