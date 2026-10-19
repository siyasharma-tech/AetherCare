// Form handling in one small hook.
//
// values   - what is typed in each field (controlled inputs)
// errors   - the current problems, worked out by the validate() function
// getError - the error for one field, but ONLY after the person has left that
//            field (touched) or tried to submit. Nobody sees "required" while
//            they are still typing their first letter.
import { useState } from "react";

function useForm(initialValues, validate) {
  const [values, setValues] = useState(initialValues);
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);

  // Re-checked on every render, so the errors are always up to date.
  const errors = validate(values);
  const isValid = Object.keys(errors).length === 0;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBlur = (event) => {
    const { name } = event.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
  };

  // For changing one value from code (e.g. clearing the time when the date changes).
  const setValue = (name, value) => setValues((prev) => ({ ...prev, [name]: value }));

  const getError = (name) => (touched[name] || submitted ? errors[name] || "" : "");

  // handleSubmit(onValid) returns the function used for <form onSubmit=...>
  const handleSubmit = (onValid) => (event) => {
    event.preventDefault();
    setSubmitted(true);

    if (!isValid) {
      // Move keyboard focus to the first field with a problem.
      const form = event.currentTarget;
      setTimeout(() => form.querySelector('[aria-invalid="true"]')?.focus(), 0);
      return;
    }
    onValid(values);
  };

  const reset = (next = initialValues) => {
    setValues(next);
    setTouched({});
    setSubmitted(false);
  };

  return { values, errors, isValid, getError, handleChange, handleBlur, handleSubmit, setValue, reset };
}

export default useForm;
