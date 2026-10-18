import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useDoctors } from "../context/DoctorsContext";
import { getBlockedSlots, getOpenSlots, nextDays } from "../utils/slots";

function DoctorDashboard() {
  const { user, logout } = useAuth();
  const { getDoctor, toggleLeave, addTiming, removeTiming, blockSlot, unblockSlot, removeDoctor } = useDoctors();
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

  const week = nextDays(7);

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
            <strong style={{ color: doctor.onLeave ? "var(--danger)" : "var(--success)" }}>
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
          <h3>This week's availability</h3>
          <p className="panel-hint">
            Busy on a particular day? Click × on a slot to remove it for that day only (for example, Tuesday 4 PM–6 PM).
            It disappears from the patient booking page for that date, and your other days stay untouched.
          </p>

          <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
            {week.map((day) => {
              const open = getOpenSlots(doctor, day.iso);
              const removed = getBlockedSlots(doctor, day.iso).filter((t) => doctor.timings.includes(t));

              return (
                <div
                  key={day.iso}
                  style={{ border: "1px solid var(--line)", borderRadius: 12, padding: "12px 16px" }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 10 }}>
                    <strong>📆 {day.label}</strong>
                    <span className="result-count">{open.length} open · {removed.length} removed</span>
                  </div>

                  <div className="timings editable-timings" style={{ marginBottom: removed.length ? 10 : 0 }}>
                    {open.length > 0 ? (
                      open.map((time) => (
                        <span key={time} className="timing-chip">
                          {time}
                          <button
                            type="button"
                            aria-label={`Remove ${time} on ${day.label}`}
                            onClick={() => blockSlot(doctor.id, day.iso, time)}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <p className="panel-hint" style={{ margin: 0 }}>No open slots this day.</p>
                    )}
                  </div>

                  {removed.length > 0 && (
                    <div className="timings editable-timings" style={{ marginBottom: 0 }}>
                      <span className="panel-hint" style={{ margin: 0, alignSelf: "center" }}>Removed:</span>
                      {removed.map((time) => (
                        <button
                          type="button"
                          key={time}
                          className="outline-btn"
                          onClick={() => unblockSlot(doctor.id, day.iso, time)}
                        >
                          ↺ {time}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className="schedule-panel">
          <h3>Daily time slots</h3>
          <p className="panel-hint">Your usual slots for every day. Patients can choose from these when booking with you.</p>

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
