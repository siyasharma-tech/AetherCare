// One number with a label, used on the dashboards. tone: "default" | "success" | "danger" | "muted"
function StatCard({ label, value, hint, icon, tone = "default" }) {
  return (
    <div className={`stat-card tone-${tone}`}>
      {icon && <span className="stat-icon" aria-hidden="true">{icon}</span>}
      <span className="stat-label">{label}</span>
      <strong className="stat-value">{value}</strong>
      {hint && <small className="stat-hint">{hint}</small>}
    </div>
  );
}

export default StatCard;
