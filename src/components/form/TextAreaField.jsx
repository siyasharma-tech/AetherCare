// Reusable multi-line input. When maxLength is given, a live character counter appears.
function TextAreaField({ label, name, value, onChange, onBlur, error, hint, required, maxLength, rows = 4, ...rest }) {
  const id = rest.id || name;
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ");

  return (
    <div className={`form-group${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required-mark" aria-hidden="true"> *</span>}
      </label>
      <textarea
        id={id}
        name={name}
        rows={rows}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy || undefined}
        {...rest}
      />
      <div className="field-meta">
        <span>
          {hint && <span className="field-hint" id={`${id}-hint`}>{hint}</span>}
        </span>
        {maxLength && (
          <span className={value.length > maxLength ? "counter over" : "counter"}>
            {value.length}/{maxLength}
          </span>
        )}
      </div>
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default TextAreaField;
