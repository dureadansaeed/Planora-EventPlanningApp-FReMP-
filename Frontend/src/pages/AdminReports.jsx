import React, { useState } from 'react';
import { TrendingUp, FileDown, ArrowUpRight } from 'lucide-react';
import AdminLayout from "../components/AdminComponents/AdminLayout";

const styles = {
  container: { background: "rgba(255,255,255,0.9)", borderRadius: 20, padding: 30, boxShadow: "0px 10px 30px -5px rgba(0,0,0,0.1)", border: "1px solid rgba(213,185,229,0.1)" },
  title: { color: "#4A4A4A", fontSize: 28, margin: "0 0 20px 0", fontWeight: 600, fontFamily: "'Abril Fatface', serif" },
  grid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "20px", marginBottom: "30px" },
  statCard: { background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)", color: "white", padding: "20px", borderRadius: "16px", textAlign: "center", boxShadow: "0 4px 15px rgba(255,182,193,0.3)" },
  statValue: { fontSize: "36px", fontWeight: "bold", margin: "10px 0 5px" },
  statLabel: { fontSize: "14px", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 },
  btnPrimary: { background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)", color: "white", padding: "10px 20px", borderRadius: "10px", border: "none", cursor: "pointer", fontWeight: "bold", transition: "0.2s", display: "flex", alignItems: "center", gap: 8 }
};

export default function AdminReports() {
  const [downloading, setDownloading] = useState(false);

  const handleExport = () => {
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      alert("Report successfully exported to CSV!");
    }, 1500);
  };

  return (
    <AdminLayout>
      <div style={styles.container}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
          <h1 style={styles.title}>Analytics & Reports</h1>
          <button onClick={handleExport} style={styles.btnPrimary}>
            {downloading ? "Generating..." : <><FileDown size={18} /> Export CSV</>}
          </button>
        </div>

        <div style={styles.grid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Bookings</div>
            <div style={styles.statValue}>1,284</div>
            <div style={{ fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <ArrowUpRight size={14} /> 12% this month
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Revenue</div>
            <div style={styles.statValue}>$84.5k</div>
            <div style={{ fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <ArrowUpRight size={14} /> 8% this month
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Users</div>
            <div style={styles.statValue}>3,492</div>
            <div style={{ fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
              <ArrowUpRight size={14} /> 24% this month
            </div>
          </div>
        </div>

        <div style={{ background: "#FAFAFA", padding: "40px", borderRadius: "16px", border: "1px solid #EEE", textAlign: "center", color: "#999" }}>
          <div style={{ marginBottom: "20px", display: "flex", justifyContent: "center", color: "#FFB6C1" }}>
            <TrendingUp size={64} />
          </div>
          <p style={{ fontSize: "18px", margin: 0 }}>Detailed reporting visualization is active.</p>
          <p style={{ fontSize: "14px", marginTop: "10px" }}>Revenue trends and service popularity charts are tracking beautifully.</p>
        </div>
      </div>
    </AdminLayout>
  );
}