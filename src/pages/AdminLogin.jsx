import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, ADMIN_CREDENTIALS } from "../context/AuthContext";

function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username.trim() || !password) {
      setError("Please enter both username and password.");
      return;
    }

    if (
      username.trim() !== ADMIN_CREDENTIALS.username ||
      password !== ADMIN_CREDENTIALS.password
    ) {
      setError("Invalid username or password.");
      return;
    }

    login("admin");
    navigate("/admin");
  };

  return (
    <main className="page">
      <div className="container">
        <Link to="/login" className="back-link">← Back to roles</Link>

        <div className="form-layout" style={{ maxWidth: 480, margin: "0 auto", gridTemplateColumns: "1fr" }}>
          <div className="appointment-form">
            <span className="eyebrow">ADMIN SIGN IN</span>
            <h1 style={{ fontSize: 32, marginBottom: 8 }}>Admin login</h1>
            <p style={{ color: "var(--muted)", marginTop: 0, marginBottom: 22 }}>
              Enter the admin username and password to access the admin panel.
            </p>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="admin-username">Username</label>
                <input
                  id="admin-username"
                  name="username"
                  type="text"
                  value={username}
                  onChange={(e) => { setUsername(e.target.value); setError(""); }}
                  placeholder="Enter admin username"
                  autoComplete="username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="admin-password">Password</label>
                <input
                  id="admin-password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(""); }}
                  placeholder="Enter admin password"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <p style={{ color: "var(--danger)", fontSize: 13, fontWeight: 700, marginTop: -8, marginBottom: 16 }}>
                  {error}
                </p>
              )}

              <button type="submit" className="primary-btn full">Sign in</button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

export default AdminLogin;
