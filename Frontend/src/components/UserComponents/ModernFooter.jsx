import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import "../../styles/Footer.css";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Header Section */}
        <div className="footer-header">
          <div className="footer-logo-section">
            <img 
              src="/planora-logo.svg" 
              alt="Planora" 
              className="footer-logo"
            />
            <div>
              <h3 className="footer-brand">Planora Studio</h3>
              <p className="footer-tagline">Plan. Book. Celebrate. Perfectly.</p>
            </div>
          </div>
          <p className="footer-description">
            Your ultimate event planning platform, connecting you with the best vendors and services for your special occasions.
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="footer-content">
          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-section-title">Quick Links</h4>
            <ul className="footer-links">
              <li><a href="#dashboard">Dashboard</a></li>
              <li><a href="#services">Services</a></li>
              <li><a href="#bookings">My Bookings</a></li>
              <li><a href="#about">About</a></li>
            </ul>
          </div>

          {/* Services */}
          <div className="footer-section">
            <h4 className="footer-section-title">Services</h4>
            <ul className="footer-links">
              <li><a href="#catering">Catering</a></li>
              <li><a href="#photography">Photography</a></li>
              <li><a href="#decoration">Decoration</a></li>
              <li><a href="#entertainment">Entertainment</a></li>
            </ul>
          </div>

          {/* Support */}
          <div className="footer-section">
            <h4 className="footer-section-title">Support</h4>
            <ul className="footer-links">
              <li><a href="#help">Help Center</a></li>
              <li><a href="#faq">FAQ</a></li>
              <li><a href="#contact">Contact Us</a></li>
              <li><a href="#feedback">Send Feedback</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div className="footer-section">
            <h4 className="footer-section-title">Legal</h4>
            <ul className="footer-links">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#cookies">Cookie Policy</a></li>
              <li><a href="#disclaimer">Disclaimer</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-section-title">Contact</h4>
            <div className="footer-contact">
              <p className="footer-contact-item">
                <span className="contact-icon"><Mail size={16} /></span>
                hello@planora.com
              </p>
              <p className="footer-contact-item">
                <span className="contact-icon"><Phone size={16} /></span>
                +1 (555) 123-4567
              </p>
              <p className="footer-contact-item">
                <span className="contact-icon"><MapPin size={16} /></span>
                New York, USA
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            © {currentYear} Planora Studio. All rights reserved.
          </p>
          <div className="footer-social">
            <a href="#facebook" className="social-link" title="Facebook"><Facebook size={20} /></a>
            <a href="#twitter" className="social-link" title="Twitter"><Twitter size={20} /></a>
            <a href="#instagram" className="social-link" title="Instagram"><Instagram size={20} /></a>
            <a href="#linkedin" className="social-link" title="LinkedIn"><Linkedin size={20} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
