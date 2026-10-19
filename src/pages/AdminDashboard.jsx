import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useDoctors, isDoctorBookable } from "../context/DoctorsContext";
import { selectActiveAppointments } from "../store/appointmentsSlice";

function AdminDashboard() {
  const { user } = useAuth();
  const { doctors } = useDoctors();
  // Redux: cancelled bookings are left out because they no longer hold a slot.
  const appointments = useSelector(selectActiveAppointments);

  if (!user || user.role !== "admin") {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>🔒</span>
          <h1>Admin sign-in required</h1>
          <p>Please sign in as admin to view this page.</p>
          <Link to="/login/admin" className="primary-btn">Go to admin login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">ADMIN PANEL</span>
            <h1>All doctors &amp; appointments</h1>
            <p>Every doctor, their time slots, and the patients booked into each slot.</p>
          </div>
        </div>

        <div className="dashboard-stats">
          <div><span>Total doctors</span><strong>{doctors.length}</strong></div>
          <div><span>Active appointments</span><strong>{appointments.length}</strong></div>
          <div><span>On leave</span><strong>{doctors.filter((d) => !isDoctorBookable(d)).length}</strong></div>
        </div>

        {doctors.length === 0 ? (
          <div className="empty-state">
            <span>👨‍⚕️</span>
            <h3>No doctors yet</h3>
            <p>Doctors who sign up will show up here.</p>
          </div>
        ) : (
          [...doctors]
            .sort((a, b) => Number(isDoctorBookable(b)) - Number(isDoctorBookable(a)))
            .map((doctor) => {
            const bookable = isDoctorBookable(doctor);
            const doctorAppointments = appointments.filter(
              (a) => a.doctorId === doctor.id
            );

            return (
              <section className="schedule-panel" key={doctor.id} style={{ opacity: bookable ? 1 : 0.75 }}>
                <h3>
                  {doctor.name} <span style={{ fontWeight: 400, color: "var(--muted)" }}>— {doctor.specialty}</span>
                </h3>
                <p className="panel-hint">
                  {doctor.experience} yrs experience • ₹{doctor.fee} fee •{" "}
                  <strong style={{ color: bookable ? "var(--success)" : "var(--danger)" }}>
                    {bookable ? "Available" : "On leave"}
                  </strong>
                </p>

                {doctor.timings.length === 0 ? (
                  <p className="panel-hint">No time slots configured for this doctor.</p>
                ) : (
                  <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
                    {doctor.timings.map((time) => {
                      const slotAppointments = doctorAppointments.filter(
                        (a) => a.time === time
                      );

                      return (
                        <div
                          key={time}
                          style={{
                            border: "1px solid var(--line)",
                            borderRadius: 12,
                            padding: "12px 16px"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                            <strong>🕐 {time}</strong>
                            <span className="result-count">
                              {slotAppointments.length} patient{slotAppointments.length === 1 ? "" : "s"}
                            </span>
                          </div>

                          {slotAppointments.length > 0 ? (
                            <ul style={{ marginTop: 10, paddingLeft: 18 }}>
                              {slotAppointments.map((a) => (
                                <li key={a.id} style={{ marginBottom: 6 }}>
                                  <strong>{a.patientName || "Unnamed patient"}</strong>
                                  {" "}— {a.date || "no date"}
                                  {a.reason && (
                                    <span style={{ color: "var(--muted)" }}> · {a.reason}</span>
                                  )}
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="panel-hint" style={{ marginTop: 8, marginBottom: 0 }}>
                              No patients booked in this slot.
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })
        )}
      </div>
    </main>
  );
}

export default AdminDashboard;
