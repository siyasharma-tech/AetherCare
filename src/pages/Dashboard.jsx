import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useDoctors, isDoctorBookable } from "../context/DoctorsContext";
import { usePatients } from "../context/PatientsContext";
import { selectAppointmentsByPatient } from "../store/appointmentsSlice";
import { byDateAsc, displayStatus, formatDate } from "../utils/appointments";
import records from "../data/records";
import AppointmentCard from "../components/AppointmentCard";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const QUICK_ACTIONS = [
  { to: "/doctors", icon: "🩺", label: "Find a doctor" },
  { to: "/appointments", icon: "📅", label: "Manage appointments" },
  { to: "/health-info", icon: "💡", label: "Health tips" },
  { to: "/contact", icon: "💬", label: "Contact support" }
];

const timeStamp = (ms) =>
  new Date(ms).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" });

// Wrapped in <RequireRole role="patient"> in App.jsx.
function Dashboard() {
  const { user } = useAuth();
  const { doctors } = useDoctors();
  const { getPatient } = usePatients();
  const patient = getPatient(user.patientId);

  // Global state from Redux. Everything below is worked out from it.
  const myAppointments = useSelector((state) => selectAppointmentsByPatient(state, user.patientId));

  const { upcoming, past, cancelled, activity } = useMemo(() => {
    const sorted = [...myAppointments].sort(byDateAsc);
    const events = [];
    myAppointments.forEach((a) => {
      events.push({ key: `b${a.id}`, time: a.createdAt || a.id, text: `Booked ${a.doctorName} (${a.specialty})` });
      if (a.cancelledAt) {
        events.push({ key: `c${a.id}`, time: a.cancelledAt, text: `Cancelled visit with ${a.doctorName}` });
      }
    });
    return {
      upcoming: sorted.filter((a) => displayStatus(a) === "Confirmed"),
      past: sorted.filter((a) => displayStatus(a) === "Past"),
      cancelled: sorted.filter((a) => displayStatus(a) === "Cancelled"),
      activity: events.sort((x, y) => y.time - x.time).slice(0, 5)
    };
  }, [myAppointments]);

  const nextAppointment = upcoming[0];
  const doctorsSeen = new Set(myAppointments.filter((a) => displayStatus(a) !== "Cancelled").map((a) => a.doctorId)).size;
  const availableDoctors = doctors.filter(isDoctorBookable).slice(0, 3);
  const firstName = (patient?.name || "there").split(" ")[0];

  return (
    <main className="page">
      <div className="container">
        <PageHeader
          eyebrow="PATIENT DASHBOARD"
          title={`Welcome back, ${firstName}`}
          description="Your appointments and shortcuts, all in one place."
        >
          <Link to="/doctors" className="primary-btn">+ Book appointment</Link>
        </PageHeader>

        <div className="stat-grid">
          <StatCard icon="📅" label="Upcoming" value={upcoming.length} tone="success" />
          <StatCard icon="🕘" label="Past visits" value={past.length} tone="muted" />
          <StatCard icon="✕" label="Cancelled" value={cancelled.length} tone="danger" />
          <StatCard icon="🩺" label="Doctors booked" value={doctorsSeen} />
        </div>

        <div className="dash-grid">
          <div className="dash-main">
            <section className="panel">
              <div className="panel-head">
                <h2>Next appointment</h2>
                <Link to="/appointments" className="text-btn">View all</Link>
              </div>

              {nextAppointment ? (
                <div className="next-card">
                  <div>
                    <strong>{nextAppointment.doctorName}</strong>
                    <span>{nextAppointment.specialty}</span>
                  </div>
                  <div className="next-when">
                    <strong>{formatDate(nextAppointment.date)}</strong>
                    <span>{nextAppointment.time}</span>
                  </div>
                </div>
              ) : (
                <EmptyState icon="📅" title="Nothing scheduled" text="Book a visit and it will show up here.">
                  <Link to="/doctors" className="primary-btn">Find a doctor</Link>
                </EmptyState>
              )}
            </section>

            {upcoming.length > 1 && (
              <section className="panel">
                <div className="panel-head">
                  <h2>Also coming up</h2>
                </div>
                <div className="appointment-list">
                  {upcoming.slice(1, 4).map((a) => (
                    <AppointmentCard key={a.id} appointment={a} />
                  ))}
                </div>
              </section>
            )}

            <section className="panel">
              <div className="panel-head">
                <h2>Doctors available to book</h2>
                <Link to="/doctors" className="text-btn">See all</Link>
              </div>
              {availableDoctors.length > 0 ? (
                <ul className="mini-list">
                  {availableDoctors.map((doctor) => (
                    <li key={doctor.id}>
                      <div className="doctor-avatar" aria-hidden="true">DR</div>
                      <div>
                        <strong>{doctor.name}</strong>
                        <span>{doctor.specialty} • ₹{doctor.fee}</span>
                      </div>
                      <Link to={`/book-appointment?doctor=${doctor.id}`} className="outline-btn">Book</Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="panel-hint">No doctors are accepting appointments right now.</p>
              )}
            </section>
          </div>

          <aside className="dash-side">
            <section className="panel">
              <div className="panel-head"><h2>Quick actions</h2></div>
              <div className="quick-actions">
                {QUICK_ACTIONS.map((action) => (
                  <Link key={action.to} to={action.to} className="quick-action">
                    <span aria-hidden="true">{action.icon}</span>
                    {action.label}
                  </Link>
                ))}
              </div>
            </section>

            <section className="panel">
              <div className="panel-head"><h2>Recent activity</h2></div>
              {activity.length > 0 ? (
                <ul className="activity-list">
                  {activity.map((event) => (
                    <li key={event.key}>
                      <span>{event.text}</span>
                      <small>{timeStamp(event.time)}</small>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="panel-hint">Your bookings and cancellations will be listed here.</p>
              )}
            </section>

            <section className="panel">
              <div className="panel-head">
                <h2>Health records</h2>
                <span className="sample-badge">Sample data</span>
              </div>
              <ul className="activity-list">
                {records.slice(0, 2).map((record) => (
                  <li key={record.id}>
                    <span>{record.title}</span>
                    <small>{record.type} • {record.date}</small>
                  </li>
                ))}
              </ul>
              <Link to="/records" className="text-btn">Open records →</Link>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
