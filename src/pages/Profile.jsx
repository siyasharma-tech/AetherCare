import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import { useDoctors } from "../context/DoctorsContext";
import { usePatients } from "../context/PatientsContext";
import { useToast } from "../context/ToastContext";
import useForm from "../hooks/useForm";
import { email, minLength, phone, required, validateAll, wholeNumberBetween } from "../utils/validators";
import TextField from "../components/form/TextField";
import SelectField from "../components/form/SelectField";

const BLOOD_GROUPS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Name is required; the other fields are optional but must be valid if filled in.
const RULES = {
  name: [required("Full name"), minLength(2, "Full name")],
  email: [email],
  phone: [phone],
  age: [wholeNumberBetween(0, 120, "Age")]
};

function Profile() {
  const { user } = useAuth();
  const { getDoctor } = useDoctors();
  const { getPatient, updatePatient } = usePatients();

  const patient = user?.role === "patient" ? getPatient(user.patientId) : null;

  const { showToast } = useToast();
  const [editing, setEditing] = useState(false);
  const form = useForm(
    patient || { name: "", email: "", phone: "", age: "", bloodGroup: "O+" },
    (values) => validateAll(values, RULES)
  );

  const onValid = (values) => {
    if (patient) {
      updatePatient(patient.id, { ...values, name: values.name.trim() });
      showToast("Profile updated.");
    }
    setEditing(false);
  };

  const handleEditClick = () => {
    form.reset(patient);
    setEditing(true);
  };

  const handleCancel = () => {
    form.reset(patient);
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

              <form className="profile-form" onSubmit={form.handleSubmit(onValid)} noValidate>
                <TextField label="Full name" name="name" required autoComplete="name"
                  value={form.values.name} onChange={form.handleChange} onBlur={form.handleBlur} error={form.getError("name")} />
                <TextField label="Email address" name="email" type="email" autoComplete="email"
                  value={form.values.email} onChange={form.handleChange} onBlur={form.handleBlur} error={form.getError("email")} />
                <TextField label="Phone number" name="phone" type="tel" autoComplete="tel"
                  value={form.values.phone} onChange={form.handleChange} onBlur={form.handleBlur} error={form.getError("phone")} />
                <TextField label="Age" name="age" type="number" min="0" max="120"
                  value={form.values.age} onChange={form.handleChange} onBlur={form.handleBlur} error={form.getError("age")} />
                <SelectField label="Blood group" name="bloodGroup"
                  value={form.values.bloodGroup} onChange={form.handleChange} onBlur={form.handleBlur}
                  options={BLOOD_GROUPS.map((group) => ({ value: group, label: group }))} />

                <div className="form-actions">
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
