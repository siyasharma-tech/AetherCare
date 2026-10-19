import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useDoctors, isDoctorBookable } from "../context/DoctorsContext";
import { useAuth } from "../context/AuthContext";
import { usePatients } from "../context/PatientsContext";
import { useToast } from "../context/ToastContext";
import { addAppointment, selectActiveAppointments } from "../store/appointmentsSlice";
import useForm from "../hooks/useForm";
import { maxLength, minLength, required, validateField } from "../utils/validators";
import { getOpenSlots, isPastDate, isPastSlot, todayISO } from "../utils/slots";
import { formatDate } from "../utils/appointments";
import PageHeader from "../components/PageHeader";
import EmptyState from "../components/EmptyState";
import SelectField from "../components/form/SelectField";
import TextField from "../components/form/TextField";
import TextAreaField from "../components/form/TextAreaField";

// Slots a doctor still offers on a date (removed ones hidden, past ones hidden).
const slotsFor = (doctors, doctorId, date) => {
  const doctor = doctors.find((item) => item.id === Number(doctorId));
  if (!doctor || !date) return [];
  return getOpenSlots(doctor, date).filter((slot) => !isPastSlot(date, slot));
};

function BookAppointment() {
  const { doctors } = useDoctors();
  const { user } = useAuth();
  const { getPatient } = usePatients();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();

  // Redux: read the shared appointment list and get a dispatch function to change it.
  const appointments = useSelector(selectActiveAppointments);
  const dispatch = useDispatch();

  const bookableDoctors = doctors.filter(isDoctorBookable);
  const requestedId = Number(searchParams.get("doctor"));
  const startDoctor =
    bookableDoctors.find((doctor) => doctor.id === requestedId) || bookableDoctors[0] || doctors[0];

  const patient = user?.role === "patient" ? getPatient(user.patientId) : null;

  // Local state: only this page cares whether the booking has been confirmed.
  const [confirmed, setConfirmed] = useState(null);

  const isSlotTaken = (doctorId, date, time) =>
    appointments.some((a) => a.doctorId === Number(doctorId) && a.date === date && a.time === time);

  // Rules for each field. The function returns an object of error messages.
  const validate = (v) => {
    const errors = {};
    if (!v.doctor) errors.doctor = "Please choose a doctor.";

    if (!v.date) errors.date = "Please choose a date.";
    else if (isPastDate(v.date)) errors.date = "You can't book a past date. Choose today or later.";

    if (!v.time) {
      errors.time = v.date ? "Please choose a time." : "Pick a date first, then choose a time.";
    } else if (!slotsFor(doctors, v.doctor, v.date).includes(v.time)) {
      errors.time = `The ${v.time} slot is no longer available on this date. Please choose another.`;
    } else if (isSlotTaken(v.doctor, v.date, v.time)) {
      errors.time = `The ${v.time} slot on this date is already booked. Please choose another.`;
    }

    const reasonError = validateField(v.reason, [
      required("Reason for visit"),
      minLength(10, "Reason for visit"),
      maxLength(300, "Reason for visit")
    ]);
    if (reasonError) errors.reason = reasonError;
    return errors;
  };

  const form = useForm(
    { doctor: String(startDoctor?.id ?? ""), date: "", time: "", reason: "" },
    validate
  );
  const { values } = form;

  const currentDoctor = useMemo(
    () => doctors.find((doctor) => doctor.id === Number(values.doctor)),
    [doctors, values.doctor]
  );
  const availableSlots = slotsFor(doctors, values.doctor, values.date);

  // Changing the doctor or date makes the chosen time invalid, so clear it.
  const handleDoctorOrDateChange = (event) => {
    form.handleChange(event);
    form.setValue("time", "");
  };

  const onValid = (v) => {
    dispatch(
      addAppointment({
        doctorId: currentDoctor.id,
        doctorName: currentDoctor.name,
        specialty: currentDoctor.specialty,
        patientId: patient.id,
        patientName: patient.name,
        date: v.date,
        time: v.time,
        reason: v.reason.trim()
      })
    );
    showToast(`Appointment booked with ${currentDoctor.name}.`);
    setConfirmed({ doctor: currentDoctor, date: v.date, time: v.time });
  };

  if (confirmed) {
    return (
      <main className="page">
        <div className="container success-page">
          <div className="success-icon">✓</div>
          <span className="eyebrow">BOOKING CONFIRMED</span>
          <h1>Your appointment is confirmed.</h1>
          <p>
            Your appointment with <strong>{confirmed.doctor.name}</strong> is saved on this device.
          </p>
          <div className="success-summary">
            <span>📆 {formatDate(confirmed.date)}</span>
            <span>🕐 {confirmed.time}</span>
            <span>👨‍⚕️ {confirmed.doctor.specialty}</span>
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
        <div className="container">
          <EmptyState as="h1" icon="🔒" title="Patient sign-in required" text="Please sign in as a patient to book an appointment.">
            <Link to="/login/patient" className="primary-btn">Go to patient login</Link>
          </EmptyState>
        </div>
      </main>
    );
  }

  if (!currentDoctor) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState as="h1" icon="👨‍⚕️" title="No doctors to book yet" text="Doctors who sign up will appear here.">
            <Link to="/doctors" className="primary-btn">Back to Doctors</Link>
          </EmptyState>
        </div>
      </main>
    );
  }

  const timeOptions = [
    { value: "", label: "Select time" },
    ...availableSlots.map((slot) => {
      const taken = isSlotTaken(values.doctor, values.date, slot);
      return { value: slot, label: taken ? `${slot} — already booked` : slot, disabled: taken };
    })
  ];

  let timeHint = "";
  if (!values.date) timeHint = "Pick a date to see the available slots.";
  else if (availableSlots.length === 0) timeHint = "No slots available on this date. Please try another day.";

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

        <form className="appointment-form" onSubmit={form.handleSubmit(onValid)} noValidate>
          <TextField label="Patient name" name="patientName" value={patient.name} onChange={() => {}} disabled />

          <SelectField
            label="Doctor"
            name="doctor"
            required
            value={values.doctor}
            onChange={handleDoctorOrDateChange}
            onBlur={form.handleBlur}
            error={form.getError("doctor")}
            options={bookableDoctors.map((item) => ({
              value: String(item.id),
              label: `${item.name} — ${item.specialty}`
            }))}
          />

          <div className="form-row">
            <TextField
              label="Date"
              name="date"
              type="date"
              required
              min={todayISO()}
              value={values.date}
              onChange={handleDoctorOrDateChange}
              onBlur={form.handleBlur}
              error={form.getError("date")}
            />

            <SelectField
              label="Time"
              name="time"
              required
              value={values.time}
              onChange={form.handleChange}
              onBlur={form.handleBlur}
              error={form.getError("time")}
              hint={timeHint}
              options={timeOptions}
            />
          </div>

          <TextAreaField
            label="Reason for visit"
            name="reason"
            required
            rows={5}
            maxLength={300}
            placeholder="Briefly describe the reason for your appointment..."
            value={values.reason}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
            error={form.getError("reason")}
          />

          <button type="submit" className="primary-btn full">Confirm Appointment →</button>
          <p className="form-note">Payments aren't processed yet — your appointment is confirmed at no charge.</p>
        </form>
      </div>
    </main>
  );
}

export default BookAppointment;
