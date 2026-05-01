export default function RoleSelector({ role, setRole }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <label style={{ color: "#4A4A4A", fontSize: 14 }}>I am a:</label>
      <div style={{ display: "flex", gap: 16 }}>
        {["user", "admin"].map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            style={{
              flex: 1,
              padding: "14px 16px 10px",
              borderRadius: 20,
              border: "none",
              cursor: "pointer",
              background:
                role === r
                  ? "linear-gradient(135deg, rgba(255,182,193,0.15) 0%, rgba(232,180,213,0.15) 100%)"
                  : "transparent",
              outline:
                role === r
                  ? "2px solid #FFB6C1"
                  : "2px solid rgba(213,185,229,0.20)",
              boxShadow:
                role === r
                  ? "0px 10px 15px -3px rgba(0,0,0,0.10)"
                  : "none",
              transition: "all 0.2s ease",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span
              style={{
                color: "#4A4A4A",
                fontSize: 16,
                fontWeight: 700,
                fontFamily: "'Arimo', sans-serif",
                textTransform: "capitalize",
              }}
            >
              {r}
            </span>
            <span style={{ color: "#6B6B6B", fontSize: 12 }}>
              {r === "user" ? "Book services" : "Manage platform"}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
