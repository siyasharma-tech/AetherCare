import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  cancelAppointment,
  removeAppointment,
  selectAppointmentsByPatient
} from "../store/appointmentsSlice";
import { byDateAsc, displayStatus } from "../utils/appointments";
import AppointmentCard from "../components/AppointmentCard";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import PageHeader from "../components/PageHeader";
import StatCard from "../components/StatCard";

const TABS = ["All", "Upcoming", "Past", "Cancelled"];
// Maps a tab to the status label shown on the badge.
const TAB_STATUS = { Upcoming: "Confirmed", Past: "Past", Cancelled: "Cancelled" };

// This page is wrapped in <RequireRole role="patient"> in App.jsx,
// so by the time it renders we know a patient is signed in.
function Appointments() {
  const { user } = useAuth();
  const { showToast } = useToast();
  const dispatch = useDispatch();

  // GLOBAL state (Redux): the shared appointment list.
  const myAppointments = useSelector((state) => selectAppointmentsByPatient(state, user.patientId));

  // LOCAL state: things only this page needs.
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [pending, setPending] = useState(null); // { appointment, action: "cancel" | "remove" }

  const withStatus = useMemo(
    () => [...myAppointments].sort(byDateAsc).map((a) => ({ appointment: a, status: displayStatus(a) })),
    [myAppointments]
  );

  const count = (status) => withStatus.filter((item) => item.status === status).length;
  const counts = {
    All: withStatus.length,
    Upcoming: count("Confirmed"),
    Past: count("Past"),
    Cancelled: count("Cancelled")
  };

  const visible = withStatus
    .filter((item) => filter === "All" || item.status === TAB_STATUS[filter])
    .filter(({ appointment: a }) => {
      const term = search.trim().toLowerCase();
      return (
        !term ||
        a.doctorName.toLowerCase().includes(term) ||
        a.specialty.toLowerCase().includes(term) ||
        a.reason.toLowerCase().includes(term)
      );
    });

  const confirmPending = () => {
    const { appointment, action } = pending;
    if (action === "cancel") {
      dispatch(cancelAppointment(appointment.id));
      showToast(`Appointment with ${appointment.doctorName} cancelled.`, "info");
    } else {
      dispatch(removeAppointment(appointment.id));
      showToast("Cancelled appointment removed from your history.", "info");
    }
    setPending(null);
  };

  const isCancel = pending?.action === "cancel";

  return (
    <main className="page">
      <div className="container">
        <PageHeader
          eyebrow="PATIENT DASHBOARD"
          title="My appointments"
          description="Keep track of your upcoming visits in one place."
        >
          <Link to="/doctors" className="primary-btn">+ Book New</Link>
        </PageHeader>

        <div className="stat-grid">
          <StatCard label="Total" value={counts.All} />
          <StatCard label="Upcoming" value={counts.Upcoming} tone="success" />
          <StatCard label="Past" value={counts.Past} tone="muted" />
          <StatCard label="Cancelled" value={counts.Cancelled} tone="danger" />
        </div>

        <div className="filter-bar">
          <label className="search-box">
            <span aria-hidden="true">⌕</span>
            <input
              type="search"
              placeholder="Search by doctor, speciality or reason..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search appointments"
            />
          </label>
        </div>

        <div className="tabs" role="group" aria-label="Filter appointments by status">
          {TABS.map((item) => (
            <button
              key={item}
              type="button"
              className={filter === item ? "tab active" : "tab"}
              aria-pressed={filter === item}
              onClick={() => setFilter(item)}
            >
              {item} <span className="tab-count">{counts[item]}</span>
            </button>
          ))}
        </div>

        <div className="appointment-list">
          {visible.length > 0 ? (
            visible.map(({ appointment }) => (
              <AppointmentCard
                key={appointment.id}
                appointment={appointment}
                onCancel={(a) => setPending({ appointment: a, action: "cancel" })}
                onRemove={(a) => setPending({ appointment: a, action: "remove" })}
              />
            ))
          ) : counts.All === 0 ? (
            <EmptyState icon="📅" title="No appointments yet" text="Book your first appointment with one of our doctors.">
              <Link to="/doctors" className="primary-btn">Find a Doctor</Link>
            </EmptyState>
          ) : (
            <EmptyState icon="⌕" title="No matching appointments" text="Try a different search or switch to another tab." />
          )}
        </div>

        <ConfirmDialog
          open={Boolean(pending)}
          title={isCancel ? "Cancel this appointment?" : "Remove from history?"}
          message={
            pending
              ? isCancel
                ? `Your visit with ${pending.appointment.doctorName} will be cancelled and the time slot released for other patients.`
                : `This permanently deletes the cancelled appointment with ${pending.appointment.doctorName} from your list.`
              : ""
          }
          confirmLabel={isCancel ? "Yes, cancel it" : "Yes, remove it"}
          cancelLabel={isCancel ? "Keep appointment" : "Keep it"}
          danger
          onConfirm={confirmPending}
          onCancel={() => setPending(null)}
        />
      </div>
    </main>
  );
}

export default Appointments;
