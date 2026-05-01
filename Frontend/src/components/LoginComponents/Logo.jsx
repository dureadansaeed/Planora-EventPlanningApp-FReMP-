import "../../styles/NavigationBar.css";

/**
 * Shared Planora Studio logo component.
 * Matches the provided screenshot exactly:
 *   - "2026" in small spaced caps (top center)
 *   - "PLANORA" in large Abril Fatface serif (crimson red)
 *   - "Studio" in Great Vibes italic script (crimson red, overlapping below-right)
 */
export default function Logo({ onClick }) {
  return (
    <div className="planora-logo" onClick={onClick} aria-label="Planora Studio">
      <span className="planora-year">2026</span>
      <span className="planora-main">PLANORA</span>
      <span className="planora-sub">Studio</span>
    </div>
  );
}
