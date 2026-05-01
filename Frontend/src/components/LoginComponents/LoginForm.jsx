import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock } from "lucide-react";
import { loginUser } from "../../api";
import Logo from "./Logo";
import FormInput from "./FormInput";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
// ... existing state ...
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getErrorMessage = (err) =>
    err?.status
      ? err.message || "Login failed. Check your credentials."
      : "Cannot reach the server. Make sure the backend is running.";

  const handleSubmit = async () => {
    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }
    setLoading(true);
    try {
      const data = await loginUser(email, password);
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("userName", data.name);
        if (data.role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/user-dashboard");
        }
      } else {
        alert(data.message || "Login failed. Check your credentials.");
      }
    } catch (err) {
      alert(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        width: "100%",
        maxWidth: 520,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "var(--backdrop-blur)",
        borderRadius: "var(--radius-3xl)",
        padding: "var(--spacing-5xl)",
        boxShadow: "0px 25px 50px -12px rgba(0,0,0,0.15)",
        border: "1px rgba(255,255,255,0.50) solid",
        display: "flex",
        flexDirection: "column",
        gap: "var(--spacing-2xl)",
        boxSizing: "border-box",
        animation: "slideInUp var(--transition-base) ease-out",
      }}
    >
      <Logo />

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-xs)" }}>
        <h1
          style={{
            fontFamily: "var(--font-family-script)",
            fontSize: "var(--font-size-4xl)",
            color: "var(--color-text-primary)",
            margin: 0,
            lineHeight: "var(--line-height-tight)",
          }}
        >
          Welcome Back
        </h1>
        <p style={{ 
          color: "var(--color-text-secondary)", 
          fontSize: "var(--font-size-base)", 
          margin: 0, 
          lineHeight: "var(--line-height-normal)",
          fontFamily: "var(--font-family-primary)",
        }}>
          Sign in to continue planning your perfect events
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)" }}>

        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={loading}
          onFocus={(e) => (e.target.style.borderColor = "rgba(255,182,193,0.8)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,182,193,0.25)")}
        />

        <PasswordInput
          label="Password"
          placeholder="Enter your password"
          icon={<Lock size={18} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          disabled={loading}
          onFocus={(e) => (e.target.style.borderColor = "rgba(255,182,193,0.8)")}
          onBlur={(e) => (e.target.style.borderColor = "rgba(255,182,193,0.25)")}
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: "100%",
            padding: "var(--spacing-lg)",
            borderRadius: "var(--radius-xl)",
            border: "none",
            background: "linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%)",
            color: "var(--color-text-inverse)",
            fontSize: "var(--font-size-base)",
            fontWeight: "var(--font-weight-bold)",
            fontFamily: "var(--font-family-primary)",
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            cursor: loading ? "not-allowed" : "pointer",
            boxShadow: "0px 10px 15px -3px rgba(255,182,193,0.40)",
            transition: "all var(--transition-base)",
            opacity: loading ? 0.7 : 1,
          }}
          onMouseEnter={(e) => !loading && (e.target.style.transform = "translateY(-2px)")}
          onMouseLeave={(e) => !loading && (e.target.style.transform = "translateY(0)")}
        >
          {loading ? "Signing In..." : "Sign In"}
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--spacing-md)" }}>
          <div style={{ flex: 1, height: 1, background: "rgba(255,182,193,0.25)" }} />
          <span style={{ color: "var(--color-text-light)", fontSize: "var(--font-size-sm)" }}>Or</span>
          <div style={{ flex: 1, height: 1, background: "rgba(255,182,193,0.25)" }} />
        </div>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "var(--color-text-secondary)", fontSize: "var(--font-size-base)" }}>
            Don't have an account?{" "}
          </span>
          <button
            onClick={() => navigate("/signup")}
            disabled={loading}
            style={{
              background: "none",
              border: "none",
              color: "var(--color-primary)",
              fontSize: "var(--font-size-base)",
              fontWeight: "var(--font-weight-bold)",
              fontFamily: "var(--font-family-primary)",
              cursor: loading ? "not-allowed" : "pointer",
              padding: 0,
              textDecoration: "underline",
              transition: "color var(--transition-base)",
            }}
            onMouseEnter={(e) => !loading && (e.target.style.color = "var(--color-primary-dark)")}
            onMouseLeave={(e) => !loading && (e.target.style.color = "var(--color-primary)")}
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
}
