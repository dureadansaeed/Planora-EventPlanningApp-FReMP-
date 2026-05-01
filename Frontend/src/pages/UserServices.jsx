import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../components/UserComponents/NavigationBar";
import ServicesSearchBar from "../components/UserComponents/ServicesSearchBar";
import ServicesGrid from "../components/UserComponents/ServicesGrid";
import UserFooter from "../components/UserComponents/UserFooter";

export default function UserServices() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilters, setSelectedFilters] = useState([]);

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
        background: "#FFF5F7",
        fontFamily: "'Arimo', sans-serif",
      }}
    >
      {/* Navigation Bar */}
      <NavigationBar />

      {/* Main Content */}
      <div
        style={{
          padding: "40px",
        }}
      >
        {/* Page Title */}
        <div style={{ marginBottom: 32 }}>
          <h1
            style={{
              fontSize: 36,
              fontWeight: 700,
              color: "#2A2A2A",
              margin: "0 0 8px 0",
              fontFamily: "'Arimo', sans-serif",
            }}
          >
            Our Services
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "#6B6B6B",
              margin: 0,
              fontFamily: "'Arimo', sans-serif",
            }}
          >
            Browse our comprehensive event planning services
          </p>
        </div>

        {/* Search and Filters */}
        <ServicesSearchBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedFilters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />

        {/* Services Grid */}
        <ServicesGrid searchQuery={searchQuery} selectedFilters={selectedFilters} />
      </div>

      {/* Footer */}
      <UserFooter />
    </div>
  );
}
