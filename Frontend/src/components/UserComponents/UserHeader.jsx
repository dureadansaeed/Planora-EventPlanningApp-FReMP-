import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../styles/UserStyles.css";

export default function UserHeader() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    if (location.pathname === "/user/services") {
      setActiveTab("Services");
    } else if (location.pathname === "/user/bookings") {
      setActiveTab("My Bookings");
    } else {
      setActiveTab("Dashboard");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const today = new Date();
  const formattedDate = `${today.getDate()}/${today.getMonth() + 1}/${today.getFullYear()}`;

  const tabs = [
    { name: "Dashboard", route: "/user-dashboard" },
    { name: "Services", route: "/user/services" },
    { name: "My Bookings", route: "/user/bookings" },
  ];

  const handleTabClick = (route) => {
    navigate(route);
  };

  return (
    <header className="user-header">
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <img
          src="/planora-logo.png"
          alt="Planora"
          style={{ height: 36, objectFit: "contain", cursor: "pointer" }}
          onClick={() => navigate("/user-dashboard")}
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/planora-logo.svg'; }}
        />
        <div style={{ fontSize: 18, fontWeight: 700, color: "white", fontFamily: "'Arimo', sans-serif" }}>Planora Studio</div>
      </div>

      {/* Navigation Tabs */}
      <div className="user-nav-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => handleTabClick(tab.route)}
            style={{
              padding: "8px 16px",
              borderRadius: 20,
              border: "none",
              background:
                activeTab === tab.name
                  ? "rgba(255,255,255,0.9)"
                  : "transparent",
              color: activeTab === tab.name ? "#E8B4D5" : "white",
              fontSize: 13,
              fontWeight: 600,
              fontFamily: "'Arimo', sans-serif",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
            onMouseEnter={(e) => {
              if (activeTab !== tab.name) {
                e.target.style.background = "rgba(255,255,255,0.2)";
              }
            }}
            onMouseLeave={(e) => {
              if (activeTab !== tab.name) {
                e.target.style.background = "transparent";
              }
            }}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Right side - User info and logout */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            color: "white",
            fontSize: 12,
            fontFamily: "'Arimo', sans-serif",
          }}
        >
          <span style={{ fontSize: 11, opacity: 0.9 }}>{formattedDate}</span>
          <span style={{ fontWeight: 600 }}>{localStorage.getItem("userName") || "User"}</span>
        </div>

        <button
          onClick={handleLogout}
          style={{
            padding: "8px 16px",
            borderRadius: 20,
            border: "none",
            background: "rgba(255,255,255,0.9)",
            color: "#E8B4D5",
            fontSize: 13,
            fontWeight: 600,
            fontFamily: "'Arimo', sans-serif",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.opacity = "0.9";
            e.target.style.transform = "translateY(-2px)";
          }}
          onMouseLeave={(e) => {
            e.target.style.opacity = "1";
            e.target.style.transform = "translateY(0)";
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
}

