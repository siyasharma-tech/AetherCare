import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientsContext";

function PatientLogin() {
  const { login } = useAuth();
  const { findPatientByName, addPatient } = usePatients();
  const navigate = useNavigate();

  const [mode, setMode] = useState("signin");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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

    const existingPatient = findPatientByName(trimmedName);

    if (mode === "signin") {
      if (!existingPatient) {
        setError("No account found with that name. Try signing up instead.");
        return;
      }
      if (password !== existingPatient.password) {
        setError("Password incorrect.");
        return;
      }
      login("patient", existingPatient.id);
      navigate("/profile");
      return;
    }

    // Sign up
    if (existingPatient) {
      setError("An account with this name already exists. Try signing in instead.");
      return;
    }

    const newPatient = addPatient({ name: trimmedName, password });
    login("patient", newPatient.id);
    navigate("/profile");
  };

  return (
    <main className="page">
      <div className="container">
        <Link to="/login" className="back-link">← Back to roles</Link>

        <div className="form-layout" style={{ maxWidth: 480, margin: "0 auto", gridTemplateColumns: "1fr" }}>
          <div className="appointment-form">
            <span className="eyebrow">PATIENT</span>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>
              {mode === "signin" ? "Patient sign in" : "Patient sign up"}
            </h1>
            <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22 }}>
              {mode === "signin"
                ? "Enter your name and password to access your account."
                : "Create a new patient account to book appointments."}
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
                <label htmlFor="patient-name">Full name</label>
                <input
                  id="patient-name"
                  name="name"
                  type="text"
                  value={name}
                  onChange={(e) => { setName(e.target.value); setError(""); }}
                  placeholder="e.g. Riddhi Sharma"
                  autoComplete="name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="patient-password">
                  {mode === "signin" ? "Password" : "Create password"}
                </label>
                <input
                  id="patient-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder={mode === "signin" ? "Enter your password" : "Choose a password"}
                  autoComplete="current-password"
                />
              </div>

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

export default PatientLogin;
