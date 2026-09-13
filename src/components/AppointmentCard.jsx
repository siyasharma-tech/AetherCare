function AppointmentCard({ appointment, onCancel }) {
  return (
    <article className="appointment-card">
      <div className="appointment-icon">📅</div>
      <div className="appointment-info">
        <h3>{appointment.doctorName}</h3>
        <p>{appointment.specialty}</p>
        <div className="appointment-details">
          <span>📆 {appointment.date}</span>
          <span>🕐 {appointment.time}</span>
        </div>
        <p className="reason">{appointment.reason}</p>
      </div>

      <div className="appointment-actions">
        <span className="status confirmed">{appointment.status}</span>
        <button className="danger-btn" onClick={() => onCancel(appointment.id)}>
          Cancel
        </button>
      </div>
    </article>
  );
}

export default AppointmentCard;