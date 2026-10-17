import { useState } from "react";
import AppointmentCard from "../components/AppointmentCard";
import useLocalStorage from "../hooks/useLocalStorage";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";

function Appointments() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useLocalStorage("aethercareAppointments", []);
  const [filter, setFilter] = useState("All");

  if (!user || user.role !== "patient") {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>🔒</span>
          <h1>Patient sign-in required</h1>
          <p>Please sign in as a patient to view your appointments.</p>
          <Link to="/login/patient" className="primary-btn">Go to patient login</Link>
        </div>
      </main>
    );
  }

  const myAppointments = appointments.filter((a) => a.patientId === user.patientId);

  const cancelAppointment = (id) => {
    setAppointments(appointments.filter((item) => item.id !== id));
  };

  const filtered = filter === "All"
    ? myAppointments
    : myAppointments.filter((item) => item.status === filter);

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">PATIENT DASHBOARD</span>
            <h1>My appointments</h1>
            <p>Keep track of your upcoming visits in one place.</p>
          </div>
          <Link to="/doctors" className="primary-btn">+ Book New</Link>
        </div>

        <div className="dashboard-stats">
          <div><span>Total</span><strong>{myAppointments.length}</strong></div>
          <div><span>Confirmed</span><strong>{myAppointments.filter((a) => a.status === "Confirmed").length}</strong></div>
          <div><span>Doctors</span><strong>{new Set(myAppointments.map((a) => a.doctorId)).size}</strong></div>
        </div>

        <div className="tabs" role="tablist">
          {["All", "Confirmed"].map((item) => (
            <button
              key={item}
              className={filter === item ? "tab active" : "tab"}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="appointment-list">
          {filtered.length > 0 ? (
            filtered.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} onCancel={cancelAppointment} />
            ))
          ) : (
            <div className="empty-state">
              <span>📅</span>
              <h3>No appointments yet</h3>
              <p>Book your first appointment with one of our doctors.</p>
              <Link to="/doctors" className="primary-btn">Find a Doctor</Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default Appointments;
