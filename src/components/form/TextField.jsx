// Reusable text input: label + input + hint + inline error message.
// Used by every form in the app, so labels and errors look and behave the same.
function TextField({ label, name, value, onChange, onBlur, error, hint, required, type = "text", ...rest }) {
  const id = rest.id || name;
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ");

  return (
    <div className={`form-group${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required-mark" aria-hidden="true"> *</span>}
      </label>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        required={false /* we show our own messages instead of the browser's */}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy || undefined}
        {...rest}
      />
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default TextField;
