import { MapPin, Mail, Phone, Clock } from "lucide-react";
import "../../styles/UserStyles.css";

export default function UserFooter() {
  return (
    <footer
      className="user-section-padding"
      style={{
        background: "linear-gradient(135deg, #FFB6C1 0%, #E8B4D5 100%)",
        color: "white",
        fontFamily: "'Arimo', sans-serif",
      }}
    >
      <div className="user-footer-grid">
        {/* About */}
        <div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            About Planora
          </h4>
          <p
            style={{
              fontSize: 12,
              color: "rgba(255,255,255,0.9)",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            Planora is your ultimate event planning platform, connecting you with the best vendors and services for your special occasions.
          </p>
        </div>

        {/* Contact & Location */}
        <div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            Contact & Location
          </h4>
          <ul
            style={{
              listStyle: "none",
              padding: 0,
              margin: 0,
            }}
          >
            <li
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <MapPin size={14} /> 123 Event Street, Islamabad, Pakistan 46000
            </li>
            <li
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Mail size={14} /> support@planora.com
            </li>
            <li
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                marginBottom: 10,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Phone size={14} /> +92 51 1234567
            </li>
            <li
              style={{
                fontSize: 12,
                color: "rgba(255,255,255,0.85)",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <Clock size={14} /> Mon-Fri: 9AM - 6PM PKT
            </li>
          </ul>
        </div>

        {/* Quick Links & Social */}
        <div>
          <h4
            style={{
              fontSize: 14,
              fontWeight: 700,
              margin: "0 0 12px 0",
            }}
          >
            Follow Us
          </h4>
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 20,
            }}
          >
            {[
              { name: "Facebook", label: "F" },
              { name: "Twitter", label: "T" },
              { name: "Instagram", label: "I" },
              { name: "LinkedIn", label: "L" },
            ].map((social) => (
              <div
                key={social.name}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                  fontWeight: 600,
                  color: "white",
                  cursor: "pointer",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.35)";
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.transform = "scale(1)";
                }}
                title={social.name}
              >
                {social.label}
              </div>
            ))}
          </div>
          <p
            style={{
              fontSize: 11,
              color: "rgba(255,255,255,0.8)",
              margin: 0,
              lineHeight: 1.5,
            }}
          >
            Stay connected with us for latest event planning tips and updates!
          </p>
        </div>
      </div>

      {/* Divider */}
      <div
        style={{
          borderTop: "1px solid rgba(255,255,255,0.2)",
          paddingTop: 20,
          marginBottom: 16,
        }}
      />

      {/* Bottom Section */}
      <div
        style={{
          textAlign: "center",
          fontSize: 11,
          color: "rgba(255,255,255,0.8)",
        }}
      >
        © 2026 Planora. All rights reserved. | Privacy Policy | Terms of Service
      </div>
    </footer>
  );
}
