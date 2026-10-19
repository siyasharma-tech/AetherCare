// Reusable dropdown. Pass options as [{ value, label, disabled }] or just use children.
function SelectField({ label, name, value, onChange, onBlur, error, hint, required, options, children, ...rest }) {
  const id = rest.id || name;
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null].filter(Boolean).join(" ");

  return (
    <div className={`form-group${error ? " has-error" : ""}`}>
      <label htmlFor={id}>
        {label}
        {required && <span className="required-mark" aria-hidden="true"> *</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        aria-required={required || undefined}
        aria-invalid={error ? "true" : "false"}
        aria-describedby={describedBy || undefined}
        {...rest}
      >
        {options
          ? options.map((option) => (
              <option key={option.value} value={option.value} disabled={option.disabled}>
                {option.label}
              </option>
            ))
          : children}
      </select>
      {hint && <p className="field-hint" id={`${id}-hint`}>{hint}</p>}
      {error && <p className="field-error" id={`${id}-error`} role="alert">{error}</p>}
    </div>
  );
}

export default SelectField;
