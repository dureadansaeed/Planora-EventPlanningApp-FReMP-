import HappyClientsCard from "./HappyClientsCard";
import "../../styles/UserStyles.css";

export default function LeftPanel() {
  return (
    <div className="auth-left-panel left-panel">
      {/* Glow behind card */}
      <div
        style={{
          position: "absolute",
          inset: -16,
          background:
            "linear-gradient(135deg, rgba(255, 182, 193, 0.30) 0%, rgba(232, 180, 213, 0.30) 100%)",
          borderRadius: 40,
          filter: "blur(24px)",
          zIndex: 0,
        }}
      />

      {/* Image card */}
      <div
        style={{
          position: "relative",
          width: 408,
          height: 608,
          borderRadius: 40,
          overflow: "hidden",
          boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
          outline: "4px rgba(255,255,255,0.50) solid",
          zIndex: 1,
        }}
      >
        <img
          src="https://plus.unsplash.com/premium_photo-1675720042825-84e20074f34a"
          alt="Event Planning"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(0deg, rgba(255,182,193,0.40) 0%, transparent 50%)",
          }}
        />
      </div>

      {/* Happy Clients badge */}
      <HappyClientsCard />
    </div>
  );
}
