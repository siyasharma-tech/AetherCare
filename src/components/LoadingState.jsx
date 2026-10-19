// Spinner shown while data is being fetched.
function LoadingState({ label = "Loading..." }) {
  return (
    <div className="state-box" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <p>{label}</p>
    </div>
  );
}

export default LoadingState;
