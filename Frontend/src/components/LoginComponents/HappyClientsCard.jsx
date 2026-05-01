import { PartyPopper } from "lucide-react";

export default function HappyClientsCard() {
  return (
    <div
      style={{
        position: "absolute",
        bottom: -20,
        right: -20,
        background: "white",
        borderRadius: 30,
        padding: "20px 24px 16px",
        boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.25)",
        display: "flex",
        flexDirection: "column",
        gap: 6,
        zIndex: 2,
        minWidth: 200,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "linear-gradient(180deg, #FFB6C1 0%, #E8B4D5 100%)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            color: "white",
          }}
        >
          <PartyPopper size={24} />
        </div>
        <div>
          <div
            style={{
              fontFamily: "'Abril Fatface', cursive",
              fontSize: 24,
              color: "#4A4A4A",
              lineHeight: 1.2,
            }}
          >
            500+
          </div>
          <div style={{ color: "#6B6B6B", fontSize: 14 }}>Happy Clients</div>
        </div>
      </div>
      <div style={{ color: "#6B6B6B", fontSize: 13 }}>
        Join hundreds of satisfied clients
      </div>
    </div>
  );
}
