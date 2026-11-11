import { useState } from 'react';
import { validate } from './validation';

export function useForm(initialValues, rules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setValue = (name, value) => {
    setValues((current) => ({ ...current, [name]: value }));
    setErrors((current) => (current[name] ? { ...current, [name]: undefined } : current));
  };

  const field = (name) => ({
    id: name,
    value: values[name],
    error: errors[name],
    onChange: (event) => setValue(name, event.target.value),
  });

  const checkbox = (name) => ({
    id: name,
    checked: values[name],
    error: errors[name],
    onChange: (event) => setValue(name, event.target.checked),
  });

  const setError = (name, message) => {
    setErrors((current) => ({ ...current, [name]: message }));
    document.getElementById(name)?.focus();
  };

  const handleSubmit = (onValid) => (event) => {
    event.preventDefault();
    const found = validate(values, rules);
    setErrors(found);
    const first = Object.keys(rules).find((name) => found[name]);
    if (first) {
      document.getElementById(first)?.focus();
      return;
    }
    onValid(values);
  };

  return { values, errors, setValues, setValue, setError, field, checkbox, handleSubmit };
}
