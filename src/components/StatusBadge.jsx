// Coloured label for an appointment status: Confirmed, Past or Cancelled.
function StatusBadge({ status }) {
  return <span className={`status badge-${status.toLowerCase()}`}>{status}</span>;
}

export default StatusBadge;
