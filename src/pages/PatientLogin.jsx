import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientsContext";
import { useToast } from "../context/ToastContext";
import useForm from "../hooks/useForm";
import { minLength, required, validateField } from "../utils/validators";
import TextField from "../components/form/TextField";

function PatientLogin() {
  const { login } = useAuth();
  const { findPatientByName, addPatient } = usePatients();
  const navigate = useNavigate();

  const { showToast } = useToast();
  const [mode, setMode] = useState("signin");
  const [error, setError] = useState(""); // problems found by the account check (not field rules)

  // Field rules: sign-up asks for a slightly stronger password than sign-in.
  const form = useForm({ name: "", password: "" }, (v) => {
    const errors = {};
    const nameError = validateField(v.name, [required("Name")]);
    const passwordError = validateField(
      v.password,
      mode === "signup" ? [required("Password"), minLength(4, "Password")] : [required("Password")]
    );
    if (nameError) errors.name = nameError;
    if (passwordError) errors.password = passwordError;
    return errors;
  });

  const handleSubmit = ({ name, password }) => {
    setError("");
    const trimmedName = name.trim();

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
      showToast(`Welcome back, ${existingPatient.name.split(" ")[0]}.`);
      navigate("/dashboard");
      return;
    }

    // Sign up
    if (existingPatient) {
      setError("An account with this name already exists. Try signing in instead.");
      return;
    }

    const newPatient = addPatient({ name: trimmedName, password });
    login("patient", newPatient.id);
    showToast("Account created. Welcome to AetherCare.");
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
                onClick={() => { setMode("signin"); setError(""); form.reset(); }}
              >
                Sign in
              </button>
              <button
                type="button"
                className={mode === "signup" ? "tab active" : "tab"}
                onClick={() => { setMode("signup"); setError(""); form.reset(); }}
              >
                Sign up
              </button>
            </div>

            <form onSubmit={form.handleSubmit(handleSubmit)} noValidate>
              <TextField
                label="Full name"
                name="name"
                id="patient-name"
                required
                value={form.values.name}
                onChange={(e) => { form.handleChange(e); setError(""); }}
                onBlur={form.handleBlur}
                error={form.getError("name")}
                placeholder="e.g. Riddhi Sharma"
                autoComplete="name"
              />

              <TextField
                label={mode === "signin" ? "Password" : "Create password"}
                name="password"
                id="patient-password"
                type="password"
                required
                value={form.values.password}
                onChange={(e) => { form.handleChange(e); setError(""); }}
                onBlur={form.handleBlur}
                error={form.getError("password")}
                hint={mode === "signup" ? "At least 4 characters." : undefined}
                placeholder={mode === "signin" ? "Enter your password" : "Choose a password"}
                autoComplete={mode === "signin" ? "current-password" : "new-password"}
              />

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
