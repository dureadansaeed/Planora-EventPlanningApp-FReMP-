import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, Calendar, Wrench, Clock, X } from "lucide-react";
import Logo from "../LoginComponents/Logo";
import "../../styles/Admin.css";

export default function AdminSidebar({ isOpen, closeSidebar }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/admin-dashboard" },
    { label: "Bookings", icon: Calendar, path: "/admin/bookings" },
    { label: "Services", icon: Wrench, path: "/admin/services" },
    { label: "Time Slots", icon: Clock, path: "/admin/time-slots" },
  ];

  return (
    <div className={`admin-sidebar ${isOpen ? "open" : ""}`}>
      <button
        className="admin-sidebar-close-btn"
        onClick={closeSidebar}
        title="Close Sidebar"
      >
        <X size={20} />
      </button>

      <div style={{ padding: "0 20px 30px" }}>
        <Logo />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
        {menuItems.map((item) => {
          const active = location.pathname === item.path;

          return (
            <button
              key={item.label}
              onClick={() => {
                navigate(item.path);
                if (closeSidebar) closeSidebar();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                padding: "12px 20px",
                border: "none",
                background: active
                  ? "linear-gradient(135deg, rgba(255,182,193,0.2) 0%, rgba(232,180,213,0.2) 100%)"
                  : "transparent",
                color: "#4A4A4A",
                fontSize: 16,
                fontWeight: active ? 700 : 400,
                fontFamily: "'Arimo', sans-serif",
                cursor: "pointer",
                textAlign: "left",
                borderRadius: active ? "0 20px 20px 0" : "0",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "rgba(255,182,193,0.1)";
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.background = "transparent";
                }
              }}
            >
              <item.icon size={20} style={{ color: active ? "#FFB6C1" : "#6B6B6B" }} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <div
        style={{
          padding: "20px",
          borderTop: "1px solid rgba(255,182,193,0.2)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 16,
            color: "white",
            fontWeight: 700,
          }}
        >
          A
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: "#4A4A4A" }}>
            {localStorage.getItem("userName") || "Admin"}
          </div>
          <div style={{ fontSize: 12, color: "#6B6B6B" }}>Administrator</div>
        </div>
      </div>
    </div>
  );
}
