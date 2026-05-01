import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTopServices } from "../../api";

const BORDER_COLORS = ["#FFB6C1", "#E8B4D5", "#D5B9E5", "#FFB6C1", "#E8B4D5", "#D5B9E5"];
const BG_COLORS = ["#FFF0F5", "#FFF5F7", "#F5F0FF", "#FFF0F5", "#FFF5F7", "#F5F0FF"];

const getFallbackImage = (category = "", title = "") => {
  const key = (category + title).toLowerCase();
  if (key.includes("wedding") || key.includes("bridal") || key.includes("engagement")) return "https://images.unsplash.com/photo-1519741497674-611481863552?w=400&h=200&fit=crop";
  if (key.includes("birthday") || key.includes("kids")) return "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=400&h=200&fit=crop";
  if (key.includes("corporate") || key.includes("seminar") || key.includes("workshop")) return "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?w=400&h=200&fit=crop";
  if (key.includes("photo")) return "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=200&fit=crop";
  if (key.includes("cater") || key.includes("food")) return "https://images.unsplash.com/photo-1555244162-803834f70033?w=400&h=200&fit=crop";
  if (key.includes("concert") || key.includes("music")) return "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=200&fit=crop";
  if (key.includes("makeup") || key.includes("beauty")) return "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=400&h=200&fit=crop";
  if (key.includes("floral") || key.includes("decor")) return "https://images.unsplash.com/photo-1487530811015-780750ccf44c?w=400&h=200&fit=crop";
  if (key.includes("graduation")) return "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop";
  if (key.includes("venue")) return "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=400&h=200&fit=crop";
  return "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400&h=200&fit=crop";
};

export default function UserFeaturedServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchTopServices()
      .then(data => { setServices(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: "40px", background: "#FFF5F7" }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: "#FFB6C1", letterSpacing: 1, marginBottom: 8, fontFamily: "'Arimo', sans-serif" }}>
          POPULAR SERVICES
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#2A2A2A", margin: 0, fontFamily: "'Arimo', sans-serif" }}>
            Featured Services
          </h2>
          <button
            onClick={() => navigate("/user/services")}
            style={{
              padding: "8px 16px", borderRadius: 20, border: "none",
              background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)",
              color: "white", fontSize: 12, fontWeight: 600,
              fontFamily: "'Arimo', sans-serif", cursor: "pointer",
              textTransform: "uppercase", letterSpacing: 0.5,
            }}
          >
            VIEW ALL
          </button>
        </div>
      </div>

      {loading && (
        <p style={{ fontFamily: "'Arimo', sans-serif", color: "#6B6B6B" }}>Loading services...</p>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
        {services.map((service, index) => (
          <div
            key={index}
            style={{
              background: BG_COLORS[index % BG_COLORS.length],
              borderRadius: 16,
              overflow: "hidden",
              border: `2px solid ${BORDER_COLORS[index % BORDER_COLORS.length]}`,
              cursor: "pointer",
              transition: "all 0.3s ease",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0px 2px 8px rgba(0,0,0,0.04)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0px 8px 16px rgba(0,0,0,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 2px 8px rgba(0,0,0,0.04)";
            }}
          >
            {/* Image — uses DB image if set, otherwise Unsplash fallback by category */}
            <img
              src={service.image && service.image !== "" ? service.image : getFallbackImage(service.category, service.title)}
              alt={service.title}
              style={{ width: "100%", height: 140, objectFit: "cover" }}
              onError={(e) => {
                e.target.src = getFallbackImage(service.category, service.title);
              }}
            />

            <div style={{ padding: 16, display: "flex", flexDirection: "column", flex: 1 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700, color: "#2A2A2A", margin: "0 0 6px 0", fontFamily: "'Arimo', sans-serif" }}>
                {service.title}
              </h3>
              <p style={{ fontSize: 12, color: "#6B6B6B", margin: "0 0 10px 0", lineHeight: 1.4, flex: 1, fontFamily: "'Arimo', sans-serif" }}>
                {service.description}
              </p>
              <div style={{ fontSize: 16, fontWeight: 700, color: BORDER_COLORS[index % BORDER_COLORS.length], marginBottom: 10, fontFamily: "'Arimo', sans-serif" }}>
                ${service.price}
              </div>
              <button
                onClick={() => navigate(`/book/${service._id || service.id || index}`)}
                style={{
                  padding: "8px 12px", borderRadius: 8, border: "none",
                  background: `linear-gradient(135deg, ${BORDER_COLORS[index % BORDER_COLORS.length]} 0%, ${BORDER_COLORS[index % BORDER_COLORS.length]}CC 100%)`,
                  color: "white", fontSize: 12, fontWeight: 600,
                  fontFamily: "'Arimo', sans-serif", cursor: "pointer",
                }}
              >
                Book Now
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}