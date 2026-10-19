import { Link } from "react-router-dom";
import logoIcon from "../assets/logo-icon.png";

function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div>
          <div className="logo footer-logo">
            <span className="logo-mark"><img src={logoIcon} alt="AetherCare logo" /></span>
            Aether<span>Care</span>
          </div>
          <p>Smart, simple healthcare appointment management.</p>
          <p>Demonstration project. It does not handle real medical information.</p>
        </div>

        <nav className="footer-links" aria-label="Footer">
          <Link to="/doctors">Doctors</Link>
          <Link to="/health-info">Health Info</Link>
          <Link to="/contact">Contact &amp; Support</Link>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;
