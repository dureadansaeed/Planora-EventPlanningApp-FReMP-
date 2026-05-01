import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Phone, Lock } from "lucide-react";
import { registerUser } from '../../api';
import Logo from "../LoginComponents/Logo";
import FormInput from "../LoginComponents/FormInput";
import PasswordInput from "../LoginComponents/PasswordInput";
import "../../styles/UserStyles.css";

export default function SignupForm() {
// ... existing state ...
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [terms, setTerms] = useState(false);
  const navigate = useNavigate();

// ... existing helpers ...
  const getErrorMessage = (err) =>
    err?.status
      ? err.message || 'Registration failed. Try again.'
      : 'Cannot reach the server. Make sure the backend is running.';

  const handleSubmit = async () => {
    if (!terms) {
      alert('You must agree to the terms and conditions.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Passwords do not match.');
      return;
    }
    if (!name || !email || !password) {
      alert('Please fill in all required fields.');
      return;
    }
    try {
      const data = await registerUser(name, email, phone, password);
      if (data.message === 'User registered successfully') {
        alert('Account created successfully! Please sign in.');
        navigate('/login');
      } else {
        alert(data.message || 'Registration failed. Try again.');
      }
    } catch (err) {
      alert(getErrorMessage(err));
    }
  };

  const focusStyle = (e) =>
    (e.target.style.borderColor = "rgba(255,182,193,0.8)");
  const blurStyle = (e) =>
    (e.target.style.borderColor = "rgba(255,182,193,0.25)");

  return (
    <div className="auth-form-card">
      <Logo />

      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        <h1
          style={{
            fontFamily: "'Abril Fatface', cursive",
            fontSize: 36,
            color: "#4A4A4A",
            margin: 0,
            lineHeight: 1.2,
          }}
        >
          Create Account
        </h1>
        <p style={{ color: "#6B6B6B", fontSize: 16, margin: 0, lineHeight: 1.5 }}>
          Join us to start planning your dream events
        </p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <FormInput
          label="Full Name"
          placeholder="Your full name"
          icon={<User size={18} />}
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        <FormInput
          label="Email Address"
          type="email"
          placeholder="you@example.com"
          icon={<Mail size={18} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        <FormInput
          label="Phone Number"
          type="tel"
          placeholder="+1 (555) 000-0000"
          icon={<Phone size={18} />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        <PasswordInput
          label="Password"
          icon={<Lock size={18} />}
          placeholder="Create a password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />
        <PasswordInput
          label="Confirm Password"
          icon={<Lock size={18} />}
          placeholder="Confirm your password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          onFocus={focusStyle}
          onBlur={blurStyle}
        />

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            cursor: "pointer",
            color: "#6B6B6B",
            fontSize: 14,
          }}
        >
          <input
            type="checkbox"
            checked={terms}
            onChange={(e) => setTerms(e.target.checked)}
            style={{ accentColor: "#FFB6C1", width: 16, height: 16 }}
          />
          I agree to the <a href="#" style={{ color: "#E8B4D5" }}>Terms & Conditions</a> and{' '}
          <a href="#" style={{ color: "#E8B4D5" }}>Privacy Policy</a>
        </label>

        <button
          onClick={handleSubmit}
          style={{
            width: "100%",
            padding: "16px",
            borderRadius: 25,
            border: "none",
            background:
              "linear-gradient(180deg, #FFB6C1 0%, #E8B4D5 100%)",
            color: "white",
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Arimo', sans-serif",
            letterSpacing: 1,
            textTransform: "uppercase",
            cursor: "pointer",
            boxShadow: "0px 10px 15px -3px rgba(255,182,193,0.40)",
            transition: "opacity 0.2s, transform 0.1s",
          }}
          onMouseEnter={(e) => (e.target.style.opacity = "0.9")}
          onMouseLeave={(e) => (e.target.style.opacity = "1")}
          onMouseDown={(e) => (e.target.style.transform = "scale(0.98)")}
          onMouseUp={(e) => (e.target.style.transform = "scale(1)")}
        >
          Create Account
        </button>

        <div style={{ textAlign: "center" }}>
          <span style={{ color: "#6B6B6B", fontSize: 16 }}>
            Already have an account?{' '}
          </span>
          <button
            onClick={() => navigate('/login')}
            style={{
              background: "none",
              border: "none",
              color: "#E8B4D5",
              fontSize: 16,
              fontWeight: 700,
              fontFamily: "'Arimo', sans-serif",
              cursor: "pointer",
              padding: 0,
            }}
          >
            Sign In Instead
          </button>
        </div>
      </div>
    </div>
  );
}
