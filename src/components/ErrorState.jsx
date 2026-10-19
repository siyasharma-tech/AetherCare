// Shown when a request fails. onRetry gives the person a way to try again.
function ErrorState({ title = "Something went wrong", message, onRetry }) {
  return (
    <div className="state-box state-error" role="alert">
      <span className="state-icon" aria-hidden="true">!</span>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
      {onRetry && (
        <button type="button" className="primary-btn" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  );
}

export default ErrorState;
