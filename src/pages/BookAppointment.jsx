import { useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useDoctors, isDoctorBookable } from "../context/DoctorsContext";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientsContext";
import useLocalStorage from "../hooks/useLocalStorage";

function BookAppointment() {
  const { doctors } = useDoctors();
  const { user } = useAuth();
  const { getPatient } = usePatients();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const reasonRef = useRef(null);
  const doctorId = Number(searchParams.get("doctor"));

  const selectedDoctor = doctors.find((doctor) => doctor.id === doctorId) || doctors[0];

  const [appointments, setAppointments] = useLocalStorage("aethercareAppointments", []);
  const [doctor, setDoctor] = useState(String(selectedDoctor.id));
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [reason, setReason] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const currentDoctor = useMemo(
    () => doctors.find((item) => item.id === Number(doctor)),
    [doctors, doctor]
  );

  const patient = user?.role === "patient" ? getPatient(user.patientId) : null;

  // A slot (doctor + date + time) is taken once one patient has booked it.
  const isSlotTaken = (targetDate, targetTime) =>
    appointments.some(
      (a) => a.doctorId === currentDoctor.id && a.date === targetDate && a.time === targetTime
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!patient) {
      setError("Please sign in as a patient to book an appointment.");
      return;
    }

    if (!date || !time || !reason.trim()) return;

    // Re-check right before booking in case the slot was taken in the meantime.
    if (isSlotTaken(date, time)) {
      setError(`The ${time} slot on ${date} is already booked. Please choose another time.`);
      return;
    }

    const newAppointment = {
      id: Date.now(),
      doctorId: currentDoctor.id,
      doctorName: currentDoctor.name,
      specialty: currentDoctor.specialty,
      patientId: patient.id,
      patientName: patient.name,
      date,
      time,
      reason: reason.trim(),
      status: "Confirmed"
    };

    setAppointments([...appointments, newAppointment]);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <main className="page">
        <div className="container success-page">
          <div className="success-icon">✓</div>
          <span className="eyebrow">BOOKING CONFIRMED</span>
          <h1>Your appointment is confirmed.</h1>
          <p>
            Your appointment with <strong>{currentDoctor.name}</strong> is saved
            on this device.
          </p>
          <div className="success-summary">
            <span>📆 {date}</span>
            <span>🕐 {time}</span>
            <span>👨‍⚕️ {currentDoctor.specialty}</span>
          </div>
          <div className="hero-actions">
            <Link to="/appointments" className="primary-btn">View Appointments</Link>
            <Link to="/doctors" className="outline-btn large">Find Another Doctor</Link>
          </div>
        </div>
      </main>
    );
  }

  if (!patient) {
    return (
      <main className="page">
        <div className="container empty-state">
          <span>🔒</span>
          <h1>Patient sign-in required</h1>
          <p>Please sign in as a patient to book an appointment.</p>
          <Link to="/login/patient" className="primary-btn">Go to patient login</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container form-layout">
        <div className="form-intro">
          <Link to="/doctors" className="back-link">← Back to Doctors</Link>
          <span className="eyebrow">APPOINTMENT</span>
          <h1>Book your visit</h1>
          <p>Choose a doctor, date and convenient time that works for you.</p>

          <div className="mini-doctor">
            <div className="doctor-avatar">DR</div>
            <div>
              <strong>{currentDoctor.name}</strong>
              <span>{currentDoctor.specialty} • ₹{currentDoctor.fee}</span>
            </div>
          </div>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="patientName">Patient name</label>
            <input id="patientName" type="text" value={patient.name} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="doctor">Doctor</label>
            <select
              id="doctor"
              value={doctor}
              onChange={(e) => { setDoctor(e.target.value); setTime(""); setError(""); }}
            >
              {doctors.filter((item) => isDoctorBookable(item)).map((item) => (
                <option value={item.id} key={item.id}>{item.name} — {item.specialty}</option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="date">Date</label>
              <input
                id="date"
                type="date"
                value={date}
                onChange={(e) => { setDate(e.target.value); setTime(""); setError(""); }}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="time">Time</label>
              <select
                id="time"
                value={time}
                onChange={(e) => { setTime(e.target.value); setError(""); }}
                required
              >
                <option value="">Select time</option>
                {currentDoctor.timings.map((item) => {
                  const taken = date ? isSlotTaken(date, item) : false;
                  return (
                    <option key={item} value={item} disabled={taken}>
                      {item}{taken ? " — already booked" : ""}
                    </option>
                  );
                })}
              </select>
              {!date && (
                <p className="panel-hint" style={{ marginTop: 6 }}>Pick a date to see which slots are already booked.</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="reason">Reason for visit</label>
            <textarea
              ref={reasonRef}
              id="reason"
              rows="5"
              placeholder="Briefly describe the reason for your appointment..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="form-error" key={error} role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="primary-btn full">Confirm Appointment →</button>
          <p className="form-note">Payments aren't processed yet — your appointment is confirmed at no charge.</p>
        </form>
      </div>
    </main>
  );
}

export default BookAppointment;
