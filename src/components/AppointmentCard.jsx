import StatusBadge from "./StatusBadge";
import { displayStatus, formatDate } from "../utils/appointments";

// One appointment. The buttons only appear when the matching handler is given:
//   onCancel -> "Cancel" (upcoming appointments)
//   onRemove -> "Remove" (cancelled ones, deletes the record)
function AppointmentCard({ appointment, onCancel, onRemove }) {
  const status = displayStatus(appointment);

  return (
    <article className={`appointment-card status-${status.toLowerCase()}`}>
      <div className="appointment-icon" aria-hidden="true">📅</div>
      <div className="appointment-info">
        <h3>{appointment.doctorName}</h3>
        <p>{appointment.specialty}</p>
        <div className="appointment-details">
          <span>📆 {formatDate(appointment.date)}</span>
          <span>🕐 {appointment.time}</span>
        </div>
        <p className="reason">{appointment.reason}</p>
      </div>

      <div className="appointment-actions">
        <StatusBadge status={status} />
        {onCancel && status === "Confirmed" && (
          <button type="button" className="danger-btn" onClick={() => onCancel(appointment)}>
            Cancel
          </button>
        )}
        {onRemove && status === "Cancelled" && (
          <button type="button" className="danger-btn" onClick={() => onRemove(appointment)}>
            Remove
          </button>
        )}
      </div>
    </article>
  );
}

export default AppointmentCard;
