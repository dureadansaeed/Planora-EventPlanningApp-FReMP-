import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LayoutDashboard, ShoppingBag, Calendar, LogOut } from "lucide-react";
import Logo from "../LoginComponents/Logo";
import "../../styles/NavigationBar.css";

export default function NavigationBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [userName, setUserName] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (location.pathname === "/user/services") {
      setActiveTab("Services");
    } else if (location.pathname === "/user/bookings") {
      setActiveTab("My Bookings");
    } else {
      setActiveTab("Dashboard");
    }
    setUserName(localStorage.getItem("userName") || "User");
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const tabs = [
    { name: "Dashboard", route: "/user-dashboard", icon: LayoutDashboard },
    { name: "Services", route: "/user/services", icon: ShoppingBag },
    { name: "My Bookings", route: "/user/bookings", icon: Calendar },
  ];

  const handleTabClick = (route) => {
    navigate(route);
    setMobileOpen(false);
  };

  return (
    <nav className={`navbar${scrolled ? " navbar--scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo — left side */}
        <Logo onClick={() => handleTabClick("/user-dashboard")} />

        {/* Hamburger — mobile only */}
        <button
          className={`navbar-burger${mobileOpen ? " open" : ""}`}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        {/* Nav Links — right side */}
        <div className={`navbar-nav${mobileOpen ? " navbar-nav--open" : ""}`}>
          {tabs.map((tab) => (
            <button
              key={tab.name}
              id={`nav-${tab.name.toLowerCase().replace(/\s+/g, "-")}`}
              className={`navbar-link${activeTab === tab.name ? " navbar-link--active" : ""}`}
              onClick={() => handleTabClick(tab.route)}
              style={{ display: "flex", alignItems: "center", gap: 8 }}
            >
              <tab.icon size={18} />
              {tab.name}
            </button>
          ))}

          <button
            id="nav-logout"
            className="navbar-link navbar-link--logout"
            onClick={() => { handleLogout(); setMobileOpen(false); }}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        {/* User greeting — desktop only */}
        <div className="navbar-right">
          <span className="navbar-user-name">Hi, {userName}!</span>
        </div>
      </div>
    </nav>
  );
}
