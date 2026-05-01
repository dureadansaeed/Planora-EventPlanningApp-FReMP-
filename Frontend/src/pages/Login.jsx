import LeftPanel from "../components/LoginComponents/LeftPanel";
import LoginForm from "../components/LoginComponents/LoginForm";
import "../styles/UserStyles.css";

export default function Login() {
  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        position: "relative",
        background:
          "linear-gradient(180deg, #FFF5F7 0%, #FFF0F5 50%, #F5F0FF 100%)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Arimo', sans-serif",
      }}
    >
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Arimo:wght@400;700&display=swap');
      `}</style>

      {/* Background blobs */}
      <div
        style={{
          width: 384,
          height: 384,
          position: "absolute",
          left: 0,
          top: 0,
          background:
            "linear-gradient(135deg, rgba(255, 182, 193, 0.20) 0%, rgba(232, 180, 213, 0.20) 100%)",
          borderRadius: "50%",
          filter: "blur(64px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          width: 384,
          height: 384,
          position: "absolute",
          right: 0,
          bottom: 80,
          background:
            "linear-gradient(135deg, rgba(213, 185, 229, 0.20) 0%, rgba(255, 212, 200, 0.20) 100%)",
          borderRadius: "50%",
          filter: "blur(64px)",
          pointerEvents: "none",
        }}
      />

      {/* Main card layout */}
      <div className="auth-container">
        <LeftPanel />
        <LoginForm />
      </div>
    </div>
  );
}