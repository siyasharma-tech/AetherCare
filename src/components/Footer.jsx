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
        </div>
      </div>
    </footer>
  );
}

export default Footer;
