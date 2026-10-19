// Route guard: shows the page only to the right kind of signed-in user.
// Otherwise it shows a friendly message with a link to sign in.
import { Link } from "react-router-dom";
import { useAuth, ROLE_LABELS } from "../context/AuthContext";
import EmptyState from "./EmptyState";

const LOGIN_PATHS = { patient: "/login/patient", doctor: "/login/doctor", admin: "/login/admin" };
const HOME_PATHS = { patient: "/dashboard", doctor: "/doctor", admin: "/admin" };

function RequireRole({ role, action = "view this page", children }) {
  const { user } = useAuth();

  if (user?.role === role) return children;

  const label = ROLE_LABELS[role].toLowerCase();

  // Signed in, but as a different role.
  if (user) {
    return (
      <main className="page">
        <div className="container">
          <EmptyState as="h1" icon="🔒" title={`This page is for ${label}s`} text={`You're signed in as a ${ROLE_LABELS[user.role].toLowerCase()}. Sign in as a ${label} to ${action}.`}>
            <Link to={HOME_PATHS[user.role]} className="primary-btn">Go to my dashboard</Link>
          </EmptyState>
        </div>
      </main>
    );
  }

  return (
    <main className="page">
      <div className="container">
        <EmptyState as="h1" icon="🔒" title={`${ROLE_LABELS[role]} sign-in required`} text={`Please sign in as a ${label} to ${action}.`}>
          <Link to={LOGIN_PATHS[role]} className="primary-btn">Go to {label} login</Link>
        </EmptyState>
      </div>
    </main>
  );
}

export default RequireRole;
