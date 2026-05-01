import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import "../../styles/Admin.css";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (role !== "admin") {
      navigate("/login");
    }
  }, [navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="admin-container">
      {/* Background blobs */}
      <div
        style={{
          width: 384,
          height: 384,
          position: "absolute",
          left: 0,
          top: 0,
          background: "linear-gradient(135deg, rgba(255, 182, 193, 0.20) 0%, rgba(232, 180, 213, 0.20) 100%)",
          borderRadius: "50%",
          filter: "blur(64px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 384,
          height: 384,
          position: "absolute",
          right: 0,
          bottom: 80,
          background: "linear-gradient(135deg, rgba(213, 185, 229, 0.20) 0%, rgba(255, 212, 200, 0.20) 100%)",
          borderRadius: "50%",
          filter: "blur(64px)",
          pointerEvents: "none",
        }}
      />

      {/* Mobile Overlay */}
      <div 
        className={`admin-sidebar-overlay ${isSidebarOpen ? "open" : ""}`} 
        onClick={closeSidebar}
      />

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} closeSidebar={closeSidebar} />

      {/* Header */}
      <AdminHeader toggleSidebar={toggleSidebar} />

      {/* Main content */}
      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}
