import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDoctors } from "../context/DoctorsContext";

const specialties = [
  { id: "Dentist", icon: "🦷" },
  { id: "Orthopedic", icon: "🦴" },
  { id: "Pediatrician", icon: "🧸" },
  { id: "General Physician", icon: "🩺" },
  { id: "Cardiologist", icon: "❤" }
];

// Normalizes a doctor name for comparison so "Rahul Mehta" and "Dr. Rahul Mehta" match.
const normalizeName = (name) =>
  name.trim().toLowerCase().replace(/^dr\.?\s+/, "");

function DoctorLogin() {
  const { login } = useAuth();
  const { doctors, addDoctor } = useDoctors();
  const navigate = useNavigate();

  const [selectedSpecialty, setSelectedSpecialty] = useState(null);
  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("");
  const [fee, setFee] = useState("");
  const [error, setError] = useState("");

  const handlePickSpecialty = (specialtyId) => {
    setSelectedSpecialty(specialtyId);
    setMode("signin");
    setName("");
    setPassword("");
    setExperience("");
    setFee("");
    setError("");
  };

  const handleBackToSpecialties = () => {
    setSelectedSpecialty(null);
    setName("");
    setPassword("");
    setExperience("");
    setFee("");
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const trimmedName = name.trim();
    if (!trimmedName) {
      setError("Please enter your name.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    const existingDoctor = doctors.find(
      (doc) =>
        doc.specialty === selectedSpecialty &&
        normalizeName(doc.name) === normalizeName(trimmedName)
    );

    if (mode === "signin") {
      if (!existingDoctor) {
        setError("No account found with that name. Try signing up instead.");
        return;
      }
      if (password !== existingDoctor.password) {
        setError("Password incorrect.");
        return;
      }
      login("doctor", existingDoctor.id);
      navigate("/doctor");
      return;
    }

    // Sign up
    if (existingDoctor) {
      setError("An account with this name already exists. Try signing in instead.");
      return;
    }

    if (experience === "" || Number(experience) < 0) {
      setError("Please enter your years of experience.");
      return;
    }

    if (fee === "" || Number(fee) < 0) {
      setError("Please enter your consultation fee.");
      return;
    }

    const newDoctor = addDoctor({
      name: trimmedName,
      specialty: selectedSpecialty,
      password,
      experience,
      fee
    });
    login("doctor", newDoctor.id);
    navigate("/doctor");
  };

  if (!selectedSpecialty) {
    return (
      <main className="page">
        <div className="container">
          <Link to="/login" className="back-link">← Back to roles</Link>

          <div className="page-heading">
            <div>
              <span className="eyebrow">DOCTOR SIGN IN</span>
              <h1>What's your specialty?</h1>
              <p>Pick your specialty to sign in or create your doctor account.</p>
            </div>
          </div>

          <div className="specialty-grid">
            {specialties.map((s) => (
              <button
                key={s.id}
                type="button"
                className="specialty-card role-select-btn"
                onClick={() => handlePickSpecialty(s.id)}
              >
                <span className="specialty-icon">{s.icon}</span>
                <h3>{s.id}</h3>
                <p>Sign in or sign up as a {s.id.toLowerCase()}.</p>
                <span className="arrow">→</span>
              </button>
            ))}
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <button type="button" className="back-link" onClick={handleBackToSpecialties} style={{ background: "none", border: 0 }}>
          ← Back to specialties
        </button>

        <div className="form-layout" style={{ maxWidth: 480, margin: "0 auto", gridTemplateColumns: "1fr" }}>
          <div className="appointment-form">
            <span className="eyebrow">{selectedSpecialty.toUpperCase()}</span>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>
              {mode === "signin" ? "Doctor sign in" : "Doctor sign up"}
            </h1>
            <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22 }}>
              {mode === "signin"
                ? "Enter your name and password to access your dashboard."
                : "Create a new doctor account for this specialty."}
            </p>

            <div className="tabs" style={{ marginBottom: 22 }}>
              <button
                type="button"
                className={mode === "signin" ? "tab active" : "tab"}
                onClick={() => { setMode("signin"); setError(""); }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={mode === "signup" ? "tab active" : "tab"}
                onClick={() => { setMode("signup"); setError(""); }}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="doctor-name">Full name</label>
                <input
                  id="doctor-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="e.g. Rahul Mehta"
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="doctor-password">
                  {mode === "signin" ? "Password" : "Create password"}
                </label>
                <input
                  id="doctor-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder={mode === "signin" ? "Enter your password" : "Choose a password"}
                  autoComplete="current-password"
                />
              </div>

              {mode === "signup" && (
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="doctor-experience">Years of experience</label>
                    <input
                      id="doctor-experience"
                      name="experience"
                      type="number"
                      min="0"
                      value={experience}
                      onChange={(e) => { setExperience(e.target.value); setError(""); }}
                      placeholder="e.g. 5"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="doctor-fee">Consultation fee (₹)</label>
                    <input
                      id="doctor-fee"
                      name="fee"
                      type="number"
                      min="0"
                      value={fee}
                      onChange={(e) => { setFee(e.target.value); setError(""); }}
                      placeholder="e.g. 600"
                    />
                  </div>
                </div>
              )}

              {error && (
                <p className="form-error" key={error} role="alert">
                  {error}
                </p>
              )}

              <button type="submit" className="primary-btn full">
                {mode === "signin" ? "Sign in" : "Create account & sign in"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DoctorLogin;
