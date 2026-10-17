import { useNavigate } from "react-router-dom";

const roles = [
  {
    id: "patient",
    icon: "♥",
    title: "Patient",
    text: "Sign in or sign up to book visits, track prescriptions and manage your medical records."
  },
  {
    id: "doctor",
    icon: "✚",
    title: "Doctor",
    text: "Manage your availability, write prescriptions and view patient history."
  },
  {
    id: "admin",
    icon: "⚙",
    title: "Admin",
    text: "Oversee doctors, patients and appointment activity platform-wide."
  }
];

function Login() {
  const navigate = useNavigate();

  const handleSelect = (roleId) => {
    navigate(`/login/${roleId}`);
  };

  return (
    <main className="page">
      <div className="container">
        <div className="page-heading">
          <div>
            <span className="eyebrow">SIGN IN</span>
            <h1>Continue as...</h1>
          </div>
        </div>

        <div className="specialty-grid">
          {roles.map((r) => (
            <button
              key={r.id}
              type="button"
              className="specialty-card role-select-btn"
              onClick={() => handleSelect(r.id)}
            >
              <span className="specialty-icon">{r.icon}</span>
              <h3>{r.title}</h3>
              <p>{r.text}</p>
              <span className="arrow">→</span>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}

export default Login;
