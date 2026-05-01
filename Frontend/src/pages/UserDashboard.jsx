import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/UserComponents/NavigationBar";
import UserHeroSection from "../components/UserComponents/UserHeroSection";
import UserQuickStats from "../components/UserComponents/UserQuickStats";
import UserPhotographySection from "../components/UserComponents/UserPhotographySection";
import UserFeaturedServices from "../components/UserComponents/UserFeaturedServices";
import UserFooter from "../components/UserComponents/UserFooter";

export default function UserDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const userRole = localStorage.getItem("userRole");
    if (userRole === "admin") {
      navigate("/admin-dashboard");
    }
  }, [navigate]);

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        background: "#FFF5F7",
        fontFamily: "'Arimo', sans-serif",
      }}
    >
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Hero Section */}
      <UserHeroSection />

      {/* Quick Stats */}
      <UserQuickStats />

      {/* Photography Section */}
      <UserPhotographySection />

      {/* Featured Services */}
      <UserFeaturedServices />

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
