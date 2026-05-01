import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Cake, 
  Heart, 
  Building2, 
  Briefcase, 
  Music, 
  BookText, 
  Palette, 
  Flower2, 
  Mic2, 
  Library, 
  Theater, 
  Star,
  Clock,
  Eye
} from 'lucide-react';
import { fetchServices } from '../../api';

const GRADIENTS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
  "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
  "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
  "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  "linear-gradient(135deg, #30cfd0 0%, #330867 100%)",
  "linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)",
  "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)",
  "linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)",
];

const ICONS = [Cake, Heart, Building2, Briefcase, Music, BookText, Palette, Flower2, Mic2, Library, Theater, Star];

export default function ServicesGrid({ searchQuery = "", selectedFilters = [] }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchServices()
      .then(data => {
        if (Array.isArray(data)) {
          setServices(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredServices = services.filter((service) => {
    const matchesSearch =
      !normalizedQuery ||
      [service.title, service.description, service.category, service.details]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(normalizedQuery));

    const category = (service.category || "").toLowerCase();
    const title = (service.title || "").toLowerCase();
    const matchesFilters =
      selectedFilters.length === 0 ||
      selectedFilters.some((filter) => {
        const label = filter.toLowerCase();
        return category.includes(label) || title.includes(label);
      });

    return matchesSearch && matchesFilters;
  });

  if (loading) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Arimo', sans-serif", color: '#6B6B6B' }}>
        Loading services...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Arimo', sans-serif", color: '#FF9800' }}>
        Could not load services. Make sure the backend is running.
      </div>
    );
  }

  if (services.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Arimo', sans-serif", color: '#6B6B6B' }}>
        No services found in the database.
      </div>
    );
  }

  if (filteredServices.length === 0) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Arimo', sans-serif", color: '#6B6B6B' }}>
        No services match your current search or filters.
      </div>
    );
  }

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 28,
        marginBottom: 32,
      }}
    >
      {filteredServices.map((service, index) => {
        const IconComponent = ICONS[index % ICONS.length];
        return (
          <div
            key={index}
            onClick={() => navigate(`/service/${service._id || service.id || index}`)}
            style={{
              background: "white",
              borderRadius: 16,
              overflow: "hidden",
              boxShadow: "0px 4px 16px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,182,193,0.15)",
              transition: "all 0.3s ease",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0px 8px 24px rgba(255,182,193,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0px 4px 16px rgba(0,0,0,0.08)";
            }}
          >
            {/* Banner — real image if available, gradient + icon fallback */}
            <div
              style={{
                height: 160,
                background: GRADIENTS[index % GRADIENTS.length],
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                overflow: "hidden",
              }}
            >
              {service.image ? (
                <img
                  src={service.image}
                  alt={service.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    position: "absolute",
                    top: 0,
                    left: 0,
                  }}
                  onError={(e) => { e.target.style.display = "none"; }}
                />
              ) : (
                <IconComponent size={64} style={{ opacity: 0.9 }} />
              )}

              {service.category && (
                <div
                  style={{
                    position: "absolute",
                    top: 12,
                    left: 12,
                    backgroundColor: "rgba(255,255,255,0.25)",
                    color: "white",
                    padding: "4px 10px",
                    borderRadius: 20,
                    fontSize: 11,
                    fontWeight: 600,
                    fontFamily: "'Arimo', sans-serif",
                    backdropFilter: "blur(4px)",
                    zIndex: 1,
                  }}
                >
                  {service.category}
                </div>
              )}
            </div>

            {/* Content */}
            <div style={{ padding: 18 }}>

              {/* Title */}
              <h3
                style={{
                  margin: "0 0 6px 0",
                  fontSize: 16,
                  fontWeight: 700,
                  color: "#2A2A2A",
                  fontFamily: "'Arimo', sans-serif",
                }}
              >
                {service.title}
              </h3>

              {/* Description */}
              {service.description && (
                <p
                  style={{
                    margin: "0 0 10px 0",
                    fontSize: 12,
                    color: "#6B6B6B",
                    fontFamily: "'Arimo', sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {service.description}
                </p>
              )}

              {/* Duration */}
              {service.duration && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    marginBottom: 10,
                    color: "#6B6B6B",
                    fontSize: 13,
                    fontFamily: "'Arimo', sans-serif",
                  }}
                >
                  <Clock size={16} />
                  <span>{service.duration}</span>
                </div>
              )}

              {/* Details */}
              {service.details && (
                <div
                  style={{
                    fontSize: 11,
                    color: "#999",
                    fontFamily: "'Arimo', sans-serif",
                    marginBottom: 12,
                    lineHeight: 1.4,
                    borderLeft: "2px solid #FFB6C1",
                    paddingLeft: 8,
                  }}
                >
                  {service.details}
                </div>
              )}

              {/* Price and Button */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  borderTop: "1px solid rgba(255,182,193,0.2)",
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: "#999", fontFamily: "'Arimo', sans-serif", marginBottom: 2 }}>
                    Starting from
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#FFB6C1", fontFamily: "'Arimo', sans-serif" }}>
                    {service.price ? `$${service.price}` : "Contact us"}
                  </div>
                </div>

                <button
                  style={{
                    background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)",
                    color: "white",
                    border: "none",
                    borderRadius: 10,
                    padding: "8px 16px",
                    fontSize: 12,
                    fontWeight: 600,
                    fontFamily: "'Arimo', sans-serif",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.05)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}
                >
                  <Eye size={14} />
                  View Details
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
