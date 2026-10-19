import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { NavLink, Link, useLocation } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import { useDoctors } from "../context/DoctorsContext";
import { usePatients } from "../context/PatientsContext";
import ThemeToggle from "./ThemeToggle";
import logoIcon from "../assets/logo-icon.png";

const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

function Navbar() {
  const { user, logout } = useAuth();
  const { getDoctor } = useDoctors();
  const { getPatient } = usePatients();
  const location = useLocation();

  const [open, setOpen] = useState(false);          // mobile menu open?
  const [scrolled, setScrolled] = useState(false);  // page scrolled past the top?
  const [pill, setPill] = useState({ left: 0, width: 0, visible: false });

  const linksRef = useRef(null);
  const progressRef = useRef(null);

  // Move the white "pill" behind a given link (or hide it if there is none).
  const place = useCallback((el) => {
    setPill((prev) => {
      if (!el) return prev.visible ? { ...prev, visible: false } : prev;
      const next = { left: el.offsetLeft, width: el.offsetWidth, visible: true };
      return prev.left === next.left && prev.width === next.width && prev.visible
        ? prev
        : next;
    });
  }, []);

  // Send the pill back to whichever link matches the current page.
  const syncToActive = useCallback(() => {
    place(linksRef.current?.querySelector(".nav-link.active"));
  }, [place]);

  const handleHover = (e) => {
    const link = e.target.closest(".nav-link");
    if (link) place(link);
  };

  // Keep the pill under the active link on navigation, role change,
  // font load and any size change of the link group.
  useLayoutEffect(() => {
    syncToActive();
    const group = linksRef.current;
    const observer = typeof ResizeObserver !== "undefined" ? new ResizeObserver(syncToActive) : null;
    if (group && observer) observer.observe(group);
    document.fonts?.ready.then(syncToActive);
    return () => observer?.disconnect();
  }, [location.pathname, user?.role, syncToActive]);

  // Add a shadow once the page scrolls, and draw reading progress along the bottom edge.
  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const y = window.scrollY;
      setScrolled(y > 8);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (progressRef.current) {
        progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(y / max, 1) : 0})`;
      }
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [location.pathname]);

  // Close the mobile menu after navigating, and when Escape is pressed.
  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const doctor = user?.role === "doctor" ? getDoctor(user.doctorId) : null;
  const patient = user?.role === "patient" ? getPatient(user.patientId) : null;
  const displayName = doctor?.name || patient?.name || (user ? ROLE_LABELS[user.role] : "");
  const initial = displayName.replace(/^Dr\.?\s+/i, "").trim().charAt(0).toUpperCase();

  return (
    <header className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container nav-inner">
        <Link to="/" className="logo">
          <span className="logo-mark"><img src={logoIcon} alt="AetherCare logo" /></span>
          Aether<span>Care</span>
        </Link>

        <div className={`nav-panel${open ? " open" : ""}`} id="nav-panel">
          <div className="nav-panel-inner">
            <nav
              className="nav-links"
              aria-label="Main navigation"
              ref={linksRef}
              onMouseOver={handleHover}
              onMouseLeave={syncToActive}
              onFocus={handleHover}
              onBlur={syncToActive}
            >
              <span
                className={`nav-pill${pill.visible ? " visible" : ""}`}
                style={{ width: pill.width, transform: `translateX(${pill.left}px)` }}
                aria-hidden="true"
              />
              <NavLink to="/" className={linkClass}>Home</NavLink>
              <NavLink to="/doctors" className={linkClass}>Doctors</NavLink>
              {user?.role === "patient" && (
                <NavLink to="/dashboard" className={linkClass}>Dashboard</NavLink>
              )}
              <NavLink to="/appointments" className={linkClass}>Appointments</NavLink>
              <NavLink to="/records" className={linkClass}>Records</NavLink>
              <NavLink to="/health-info" className={linkClass}>Health Info</NavLink>
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
                <span className="nav-avatar" aria-hidden="true">{initial}</span>
                <span className="nav-user">
                  <strong>{displayName}</strong>
                  <small>{ROLE_LABELS[user.role]}</small>
                </span>
                <button type="button" className="nav-logout" onClick={logout}>Logout</button>
              </div>
            ) : (
              <Link to="/login" className="nav-cta">Login</Link>
            )}
          </div>
        </div>

        <div className="nav-end">
          <ThemeToggle />
          <button
            type="button"
            className="nav-toggle"
            aria-expanded={open}
            aria-controls="nav-panel"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>
        </div>
      </div>

      <span className="nav-progress" ref={progressRef} aria-hidden="true" />
    </header>
  );
}

export default Navbar;
