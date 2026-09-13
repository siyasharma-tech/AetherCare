import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDoctors } from "../context/DoctorsContext";

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { getDoctor, toggleLeave, addTiming, removeTiming, removeDoctor } = useDoctors();
  const [newTime, setNewTime] = useState("");
  const navigate = useNavigate();

  if (!user || user.role !== "doctor") {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>🔒</span>
          <h1>Doctor sign-in required</h1>
          <p>Please sign in as a doctor to manage your schedule.</p>
          <Link to="/login" className="primary-btn">Go to login</Link>
        </div>
      </main>
    );
  }

  const doctor = getDoctor(user.doctorId);

  if (!doctor) {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>?</span>
          <h1>Doctor profile not found</h1>
          <p>Try signing in again from the login page.</p>
          <Link to="/login" className="primary-btn">Go to login</Link>
        </div>
      </main>
    );
  }

  const handleAddTime = (e) => {
    e.preventDefault();
    addTiming(doctor.id, newTime);
    setNewTime("");
  };

  const handleRemoveProfile = () => {
    const confirmed = window.confirm(
      "Remove your doctor profile? This can't be undone and you'll be signed out."
    );
    if (!confirmed) return;

    removeDoctor(doctor.id);
    logout();
    navigate("/");
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">DOCTOR DASHBOARD</span>
            <h1>{doctor.name}</h1>
            <p>{doctor.specialty} • {doctor.experience} yrs experience</p>
          </div>
        </div>

        {doctor.onLeave && (
          <div className="leave-banner">
            <strong>You're marked as on leave.</strong>
            <span>Patients will see a red "On leave" notice on your profile and can't book new appointments until you turn this off.</span>
          </div>
        )}

        <div className="dashboard-stats">
          <div>
            <span>Status</span>
            <strong style={{ color: doctor.onLeave ? "#b64c4c" : "#167a55" }}>
              {doctor.onLeave ? "On leave" : "Available"}
            </strong>
          </div>
          <div>
            <span>Open time slots</span>
            <strong>{doctor.timings.length}</strong>
          </div>
          <div>
            <span>Consultation fee</span>
            <strong>₹{doctor.fee}</strong>
          </div>
        </div>

        <section className="schedule-panel">
          <h3>Leave status</h3>
          <p className="panel-hint">Toggle this on when you're unavailable — patients will see it immediately.</p>
          <label className="leave-toggle">
            <input
              type="checkbox"
              checked={doctor.onLeave}
              onChange={() => toggleLeave(doctor.id)}
            />
            <span className="leave-toggle-track" aria-hidden="true" />
            <span>{doctor.onLeave ? "I'm on leave" : "I'm available"}</span>
          </label>
        </section>

        <section className="schedule-panel">
          <h3>Appointment time slots</h3>
          <p className="panel-hint">These are the times patients can choose from when booking with you.</p>

          <div className="timings editable-timings">
            {doctor.timings.length > 0 ? (
              doctor.timings.map((time) => (
                <span key={time} className="timing-chip">
                  {time}
                  <button
                    type="button"
                    aria-label={`Remove ${time}`}
                    onClick={() => removeTiming(doctor.id, time)}
                  >
                    ×
                  </button>
                </span>
              ))
            ) : (
              <p className="panel-hint">No time slots yet — add one below.</p>
            )}
          </div>

          <form className="add-timing-form" onSubmit={handleAddTime}>
            <input
              type="text"
              placeholder="e.g. 6:00 PM"
              value={newTime}
              onChange={(e) => setNewTime(e.target.value)}
              aria-label="New time slot"
            />
            <button type="submit" className="outline-btn">Add slot</button>
          </form>
        </section>

        <section className="schedule-panel">
          <h3>Danger zone</h3>
          <p className="panel-hint">Permanently remove your doctor profile from AetherCare. You'll be signed out and this can't be undone.</p>
          <button type="button" className="danger-outline-btn" onClick={handleRemoveProfile}>
            Remove my profile
          </button>
        </section>
      </div>
    </main>
  );
}

export default DoctorDashboard;
