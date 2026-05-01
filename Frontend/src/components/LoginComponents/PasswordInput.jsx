import { Eye, EyeOff, Lock } from "lucide-react";

export default function PasswordInput({
  label,
  placeholder,
  value,
  onChange,
  showPassword,
  setShowPassword,
  onFocus,
  onBlur,
  icon,
  disabled = false,
}) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-md)", fontFamily: "var(--font-family-primary)" }}>
      <label style={{ 
        color: "var(--color-text-primary)", 
        fontSize: "var(--font-size-sm)",
        fontWeight: "var(--font-weight-semibold)",
      }}>
        {label}
      </label>
      <div style={{ position: "relative" }}>
        {icon && (
          <span
            style={{
              position: "absolute",
              left: "var(--spacing-lg)",
              top: "50%",
              transform: "translateY(-50%)",
              pointerEvents: "none",
              fontSize: "var(--font-size-lg)",
              color: "var(--color-text-secondary)",
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon}
          </span>
        )}
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onFocus={onFocus}
          onBlur={onBlur}
          disabled={disabled}
          style={{
            width: "100%",
            padding: icon ? "var(--spacing-lg) 48px var(--spacing-lg) 44px" : "var(--spacing-lg) 48px var(--spacing-lg) var(--spacing-lg)",
            borderRadius: "var(--radius-xl)",
            border: "1px solid rgba(255,182,193,0.25)",
            background: "rgba(255,255,255,0.70)",
            fontSize: "var(--font-size-base)",
            color: "var(--color-text-primary)",
            outline: "none",
            boxSizing: "border-box",
            fontFamily: "var(--font-family-primary)",
            transition: "all var(--transition-base)",
            opacity: disabled ? 0.6 : 1,
            cursor: disabled ? "not-allowed" : "text",
          }}
        />
        <button
          onClick={() => !disabled && setShowPassword(!showPassword)}
          disabled={disabled}
          style={{
            position: "absolute",
            right: "var(--spacing-lg)",
            top: "50%",
            transform: "translateY(-50%)",
            background: "none",
            border: "none",
            cursor: disabled ? "not-allowed" : "pointer",
            color: "var(--color-text-secondary)",
            fontSize: "var(--font-size-lg)",
            padding: 0,
            lineHeight: 1,
            transition: "color var(--transition-base)",
            display: "flex",
            alignItems: "center",
          }}
          onMouseEnter={(e) => !disabled && (e.currentTarget.style.color = "#FFB6C1")}
          onMouseLeave={(e) => !disabled && (e.currentTarget.style.color = "var(--color-text-secondary)")}
        >
          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
    </div>
  );
}
