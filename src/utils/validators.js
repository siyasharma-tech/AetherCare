// Validation rules for forms. Each rule is a small function:
//   give it a value -> it returns an error message, or "" when the value is fine.
// validateField() runs a list of rules and returns the first message.

export const required = (label) => (value) =>
  String(value ?? "").trim() ? "" : `${label} is required.`;

export const minLength = (min, label) => (value) => {
  const text = String(value ?? "").trim();
  return text && text.length < min ? `${label} must be at least ${min} characters.` : "";
};

export const maxLength = (max, label) => (value) =>
  String(value ?? "").trim().length > max ? `${label} must be ${max} characters or fewer.` : "";

// Optional fields: empty is fine, but if something is typed it must be valid.
export const email = (value) => {
  const text = String(value ?? "").trim();
  return !text || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(text)
    ? ""
    : "Enter a valid email address, like name@example.com.";
};

export const phone = (value) => {
  const text = String(value ?? "").trim();
  return !text || /^\+?[0-9\s-]{10,15}$/.test(text)
    ? ""
    : "Enter a valid phone number (10 to 15 digits).";
};

export const wholeNumberBetween = (min, max, label) => (value) => {
  const text = String(value ?? "").trim();
  if (!text) return "";
  const number = Number(text);
  return Number.isInteger(number) && number >= min && number <= max
    ? ""
    : `${label} must be a whole number between ${min} and ${max}.`;
};

export function validateField(value, rules) {
  for (const rule of rules) {
    const message = rule(value);
    if (message) return message;
  }
  return "";
}

// validateAll(values, { name: [required("Name")], email: [email] })
//   -> { name: "Name is required." }   (only fields with a problem)
export function validateAll(values, ruleMap) {
  const errors = {};
  Object.keys(ruleMap).forEach((field) => {
    const message = validateField(values[field], ruleMap[field]);
    if (message) errors[field] = message;
  });
  return errors;
}
