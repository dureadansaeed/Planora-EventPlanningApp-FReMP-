import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchMyBookings } from "../../api";
import "../../styles/UserStyles.css";

const API_BASE = '/api';

export default function UserQuickStats() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ services: 0, upcoming: 0, past: 0 });

  useEffect(() => {
    async function loadStats() {
      try {
        const [servRes, myBookings] = await Promise.all([
          fetch(`${API_BASE}/services/`),
          fetchMyBookings()
        ]);
        
        let servicesCount = 6;
        let upcomingCount = 0;
        let pastCount = 0;

        if (servRes.ok) {
          const sData = await servRes.json();
          if (Array.isArray(sData)) servicesCount = sData.length;
        }

        if (Array.isArray(myBookings)) {
          const now = new Date();
          myBookings.forEach(b => {
             if(b.event_date) {
               const d = new Date(b.event_date);
               if (d >= now) upcomingCount++;
               else pastCount++;
             }
          });
        }

        setStats({ services: servicesCount, upcoming: upcomingCount, past: pastCount });

      } catch (err) {
        console.error("Failed to load quick stats", err);
      }
    }
    loadStats();
  }, []);

  const primaryCards = [
    {
      title: "Book a Service",
      description: "Start planning your next event today",
      isPrimary: true,
      color: "#FFB6C1",
      onClick: () => navigate("/user/services"),
    },
    {
      label: "Browse",
       title: "View Services",
      description: `Explore our ${stats.services > 0 ? stats.services : "available"} services`,
      isPrimary: false,
      onClick: () => navigate("/user/services"),
    },
    {
      label: "Your Events",
      title: "My Bookings",
      description: `${stats.upcoming} upcoming events scheduled`,
      isPrimary: false,
      onClick: () => navigate("/user/bookings")
    },
  ];

  const statCards = [
    {
      label: "Available Services",
      value: stats.services,
      color: "#FFB6C1",
    },
    {
      label: "Upcoming Events",
      value: stats.upcoming,
      color: "#E8B4D5",
    },
    {
      label: "Completed Events",
      value: stats.past,
      color: "#D5B9E5",
    },
  ];

  return (
    <div
      className="user-section-padding"
      style={{
        paddingTop: 0, // override top padding since hero section covers it
        background: "#FFF5F7",
      }}
    >
      {/* Primary Cards */}
      <div className="user-grid-3" style={{ marginBottom: 24 }}>
        {primaryCards.map((card, index) => (
          <div
            key={index}
            onClick={card.onClick}
            style={{
              background: card.isPrimary
                ? `linear-gradient(135deg, ${card.color} 0%, #E8B4D5 100%)`
                : "white",
              borderRadius: 16,
              padding: 20,
              cursor: "pointer",
              transition: "all 0.3s ease",
              minHeight: "140px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-start",
              color: card.isPrimary ? "white" : "#2A2A2A",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
              border: card.isPrimary ? "none" : "1px solid rgba(255,182,193,0.2)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow =
                "0px 8px 20px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow =
                "0px 4px 12px rgba(0,0,0,0.06)";
            }}
          >
            {card.label && (
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: card.isPrimary
                    ? "rgba(255,255,255,0.8)"
                    : "#FFB6C1",
                  letterSpacing: 0.5,
                  marginBottom: 8,
                  fontFamily: "'Arimo', sans-serif",
                  textTransform: "uppercase"
                }}
              >
                {card.label}
              </div>
            )}

            {/* decorative header removed (icons were removed) */}

            <div
              style={{
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Arimo', sans-serif",
                marginBottom: 4,
              }}
            >
              {card.title}
            </div>

            <div
              style={{
                fontSize: 12,
                color: card.isPrimary ? "rgba(255,255,255,0.8)" : "#6B6B6B",
                fontFamily: "'Arimo', sans-serif",
              }}
            >
              {card.description}
            </div>
          </div>
        ))}
      </div>

      {/* Stat Cards */}
      <div className="user-grid-3">
        {statCards.map((stat, index) => (
          <div
            key={index}
            style={{
              background: "white",
              borderRadius: 14,
              padding: 20,
              border: "1px solid rgba(255,182,193,0.2)",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#8A8A8A",
                marginBottom: 8,
                fontFamily: "'Arimo', sans-serif",
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: 0.5
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 700,
                color: stat.color,
                fontFamily: "'Arimo', sans-serif",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
