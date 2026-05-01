import { useNavigate } from "react-router-dom";
import "../../styles/Sections.css";

export default function UserHeroSectionModern() {
  const navigate = useNavigate();

  return (
    <section className="hero" style={{
      marginBottom: "var(--spacing-5xl)",
      backgroundImage: "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 600\"><defs><pattern id=\"dots\" x=\"0\" y=\"0\" width=\"40\" height=\"40\" patternUnits=\"userSpaceOnUse\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"rgba(255,255,255,0.1)\"/></pattern></defs><rect width=\"1200\" height=\"600\" fill=\"%23FFB6C1\"/><rect width=\"1200\" height=\"600\" fill=\"url(%23dots)\"/></svg>')"
    }}>
      <div className="hero-content">
        <h1 className="hero-title">Plan Your Perfect Event</h1>
        <p className="hero-subtitle">
          Connect with the best vendors and services. Book with confidence. Celebrate with style.
        </p>
        <div className="hero-cta">
          <button 
            className="hero-cta-btn hero-cta-btn-primary"
            onClick={() => navigate("/user/services")}
          >
            Explore Services
          </button>
          <button 
            className="hero-cta-btn hero-cta-btn-secondary"
            onClick={() => navigate("/user/bookings")}
          >
            View My Bookings
          </button>
        </div>
      </div>
    </section>
  );
}
