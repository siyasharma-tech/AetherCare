import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import { useDoctors } from "../context/DoctorsContext";
import { usePatients } from "../context/PatientsContext";

function Profile() {
  const { user } = useAuth();
  const { getDoctor } = useDoctors();
  const { getPatient, updatePatient } = usePatients();

  const patient = user?.role === "patient" ? getPatient(user.patientId) : null;

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(
    patient || { name: "", email: "", phone: "", age: "", bloodGroup: "O+" }
  );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (patient) {
      updatePatient(patient.id, form);
    }
    setEditing(false);
  };

  const handleEditClick = () => {
    setForm(patient);
    setEditing(true);
  };

  const handleCancel = () => {
    setForm(patient);
    setEditing(false);
  };

  // Not logged in — show a login prompt instead of a profile.
  if (!user) {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>🔒</span>
          <h1>You're not logged in</h1>
          <p>Log in to view and manage your AetherCare profile.</p>
          <Link to="/login" className="primary-btn">Go to login</Link>
        </div>
      </main>
    );
  }

  const roleLabel = ROLE_LABELS[user.role];
  const doctor = user.role === "doctor" ? getDoctor(user.doctorId) : null;
  const displayName = doctor ? doctor.name : patient ? patient.name : roleLabel;
  const initial = displayName?.trim()?.charAt(0)?.toUpperCase() || "?";

  return (
    <main className="page">
      <div className="container profile-layout">
        <aside className="profile-side">
          <div className="profile-avatar">{initial}</div>
          <h2>{displayName}</h2>
          <p>{doctor ? doctor.specialty : roleLabel}</p>
          <div className="profile-badge">✓ Profile active</div>
        </aside>

        <section className="profile-main">
          <span className="eyebrow">ACCOUNT</span>
          <h1>My profile</h1>

          {!patient ? (
            <>
              <p>
                {doctor
                  ? "Manage your professional details from your doctor dashboard."
                  : "Admin accounts don't have an editable profile."}
              </p>
              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <span>Role</span>
                  <strong>{roleLabel}</strong>
                </div>
              </div>
              {doctor && (
                <Link to="/doctor" className="primary-btn" style={{ marginTop: 24 }}>
                  Go to my dashboard
                </Link>
              )}
            </>
          ) : !editing ? (
            <>
              <p>Your saved contact information.</p>

              <div className="profile-view-grid">
                <div className="profile-view-item">
                  <span>Full name</span>
                  <strong>{patient.name}</strong>
                </div>
                <div className="profile-view-item">
                  <span>Email address</span>
                  <strong>{patient.email || "—"}</strong>
                </div>
                <div className="profile-view-item">
                  <span>Phone number</span>
                  <strong>{patient.phone || "—"}</strong>
                </div>
                <div className="profile-view-item">
                  <span>Age</span>
                  <strong>{patient.age || "—"}</strong>
                </div>
                <div className="profile-view-item">
                  <span>Blood group</span>
                  <strong>{patient.bloodGroup}</strong>
                </div>
                <div className="profile-view-item">
                  <span>Role</span>
                  <strong>{roleLabel}</strong>
                </div>
              </div>

              <button type="button" className="primary-btn" onClick={handleEditClick} style={{ marginTop: 24 }}>
                Edit profile
              </button>
            </>
          ) : (
            <>
              <p>Update your basic information below.</p>

              <form className="profile-form" onSubmit={handleSubmit}>
                {[
                  ["name", "Full name", "text"],
                  ["email", "Email address", "email"],
                  ["phone", "Phone number", "tel"],
                  ["age", "Age", "number"]
                ].map(([name, label, type]) => (
                  <div className="form-group" key={name}>
                    <label htmlFor={name}>{label}</label>
                    <input id={name} name={name} type={type} value={form[name]} onChange={handleChange} />
                  </div>
                ))}

                <div className="form-group">
                  <label htmlFor="bloodGroup">Blood group</label>
                  <select id="bloodGroup" name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((item) => <option key={item}>{item}</option>)}
                  </select>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button type="submit" className="primary-btn">Save changes</button>
                  <button type="button" className="outline-btn" onClick={handleCancel}>Cancel</button>
                </div>
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  );
}

export default Profile;
