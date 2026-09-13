import { NavLink, Link } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import logoIcon from "../assets/logo-icon.png";

function Navbar() {
  const linkClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const { user, logout } = useAuth();

  return (
    <header className="navbar">
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-mark"><img src={logoIcon} alt="AetherCare logo" /></span>
          Aether<span>Care</span>
        </Link>

        <nav className="nav-links" aria-label="Main navigation">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/doctors" className={linkClass}>Doctors</NavLink>
          <NavLink to="/appointments" className={linkClass}>Appointments</NavLink>
          <NavLink to="/records" className={linkClass}>Records</NavLink>
          <NavLink to="/profile" className={linkClass}>Profile</NavLink>
          {user?.role === "doctor" && (
            <NavLink to="/doctor" className={linkClass}>My Schedule</NavLink>
          )}
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>Admin Panel</NavLink>
          )}
        </nav>

        {user ? (
          <div className="nav-auth">
            <span className="result-count">{ROLE_LABELS[user.role]}</span>
            <button type="button" className="text-btn" onClick={logout}>Logout</button>
          </div>
        ) : (
          <Link to="/login" className="nav-cta">Login</Link>
        )}
      </div>
    </header>
  );
}

export default Navbar;
