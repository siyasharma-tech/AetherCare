import { Link } from "react-router-dom";
import SectionTitle from "../components/SectionTitle";

const specialties = [
  ["♥", "Cardiology", "Heart & circulation", "Cardiologist"],
  ["✦", "Dermatology", "Skin & hair care", "Dermatologist"],
  ["✚", "General Care", "Everyday healthcare", "General Physician"],
  ["⌁", "Dentistry", "Oral healthcare", "Dentist"]
];

function Home() {
  return (
    <main>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <span className="eyebrow">SMART HEALTHCARE</span>
            <h1>Your health deserves <span>better care.</span></h1>
            <p>
              Find trusted doctors, choose a convenient time and manage
              your appointments — all in one simple place.
            </p>
            <div className="hero-actions">
              <Link to="/doctors" className="primary-btn">Find a Doctor →</Link>
              <Link to="/appointments" className="text-btn">My Appointments</Link>
            </div>
            <div className="trust-row">
              <div><strong>50+</strong><span>Doctors</span></div>
              <div><strong>10+</strong><span>Specialities</span></div>
              <div><strong>4.8★</strong><span>Avg. Rating</span></div>
            </div>
          </div>

          <div className="hero-visual" aria-label="Healthcare illustration">
            <div className="glow-circle"></div>
            <div className="doctor-illustration">
              <div className="illustration-cross">+</div>
              <div className="doctor-head"></div>
              <div className="doctor-body">
                <div className="stethoscope">◯</div>
                <div className="pocket"></div>
              </div>
            </div>
            <div className="floating-card card-one">
              <span>✓</span>
              <div><strong>Appointment</strong><small>Confirmed</small></div>
            </div>
            <div className="floating-card card-two">
              <span>★</span>
              <div><strong>4.8 / 5</strong><small>Patient rating</small></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <SectionTitle
            eyebrow="EXPLORE"
            title="Care for every need"
            description="Choose a speciality and connect with the right healthcare professional."
          />

          <div className="specialty-grid">
            {specialties.map(([icon, title, text, specialtyValue]) => (
              <Link
                to={`/doctors?specialty=${encodeURIComponent(specialtyValue)}`}
                className="specialty-card"
                key={title}
              >
                <span className="specialty-icon">{icon}</span>
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="arrow">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container">
          <SectionTitle
            eyebrow="WHY AETHERCARE"
            title="Healthcare, without the hassle"
            description="A simple patient experience designed around the things that matter."
          />
          <div className="benefits-grid">
            <div className="benefit"><span>01</span><h3>Easy discovery</h3><p>Search doctors by name or speciality and compare key details.</p></div>
            <div className="benefit"><span>02</span><h3>Simple booking</h3><p>Pick a date and available time without complicated forms.</p></div>
            <div className="benefit"><span>03</span><h3>Organized records</h3><p>Keep appointments and medical records together in one dashboard.</p></div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;