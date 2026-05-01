import { useLocation, useNavigate } from "react-router-dom";
import { Menu, LogOut } from "lucide-react";
import Logo from "../LoginComponents/Logo";
import "../../styles/NavigationBar.css";
import "../../styles/Admin.css";

export default function AdminHeader({ toggleSidebar }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userRole");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const getPageTitle = () => {
    switch (location.pathname) {
      case "/admin-dashboard": return "Admin Dashboard";
      case "/admin/bookings":  return "Manage Bookings";
      case "/admin/services":  return "Services";
      case "/admin/time-slots": return "Time Slots";
      default: return "Admin Panel";
    }
  };

  const getPageDescription = () => {
    switch (location.pathname) {
      case "/admin-dashboard":  return "Live booking overview and recent activity.";
      case "/admin/bookings":   return "Review, approve, and reject customer bookings.";
      case "/admin/services":   return "Create, edit, and retire customer-facing services.";
      case "/admin/time-slots": return "Control the booking dates and time windows.";
      default: return "Admin management interface.";
    }
  };

  return (
    <header className="admin-header">
      {/* Left: hamburger + logo + page info */}
      <div className="admin-header-left">
        {/* Mobile hamburger */}
        {toggleSidebar && (
          <button
            className="admin-hamburger"
            onClick={toggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu size={24} />
          </button>
        )}

        {/* Planora logo */}
        <Logo onClick={() => navigate("/admin-dashboard")} />

        {/* Page title / description */}
        <div className="admin-header-page-info">
          <h1 className="admin-header-title">{getPageTitle()}</h1>
          <p className="admin-header-desc">{getPageDescription()}</p>
        </div>
      </div>

      {/* Right: logout */}
      <div className="admin-header-right">
        <button
          id="admin-nav-logout"
          onClick={handleLogout}
          className="btn-logout"
          style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}
