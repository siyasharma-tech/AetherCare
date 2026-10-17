import { Link } from "react-router-dom";

function NotFound() {
  return (
    <main className="page">
      <div className="container empty-state">
        <span className="error-number">404</span>
        <h1>Page not found</h1>
        <p>The page you're looking for doesn't exist.</p>
        <Link to="/" className="primary-btn">Return Home</Link>
      </div>
    </main>
  );
}

export default NotFound;