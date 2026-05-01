import "../../styles/UserStyles.css";

export default function UserHeroSection() {
  const userName = localStorage.getItem("userName") || "there";

  const today = new Date();
  const formattedDate = today.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="user-section-padding" style={{ background: "#FFF5F7" }}>
      <div
        style={{
          background: "white",
          borderRadius: 20,
          padding: 32,
          boxShadow: "0px 4px 12px rgba(0,0,0,0.06)",
          border: "1px solid rgba(255,182,193,0.2)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: "#FFB6C1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#FFB6C1",
              letterSpacing: 1,
              fontFamily: "'Arimo', sans-serif",
            }}
          >
            WELCOME BACK
          </span>
        </div>

        <p style={{ fontSize: 13, color: "#999", margin: "0 0 8px 0", fontFamily: "'Arimo', sans-serif" }}>
          {formattedDate}
        </p>

        <h2
          style={{
            fontSize: 36,
            fontWeight: 700,
            color: "#2A2A2A",
            margin: "0 0 12px 0",
            fontFamily: "'Arimo', sans-serif",
          }}
        >
          Hello, {userName}!
        </h2>

        <h3
          style={{
            fontSize: 22,
            fontWeight: 600,
            color: "#FFB6C1",
            margin: "0 0 16px 0",
            fontFamily: "'Arimo', sans-serif",
          }}
        >
          Plan Your Events, Stress-Free
        </h3>

        <p style={{ fontSize: 14, color: "#6B6B6B", margin: 0, lineHeight: 1.6, fontFamily: "'Arimo', sans-serif" }}>
          Discover and book the best event services for your special occasions.
          From photography to decoration, we've got everything covered.
        </p>
      </div>
    </div>
  );
}