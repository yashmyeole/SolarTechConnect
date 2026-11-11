const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

const isBlank = (value) => (typeof value === 'string' ? value.trim() === '' : value == null || value === false);

export const required = (message) => (value) => (isBlank(value) ? message : '');

export const email =
  (message = 'Enter an email address like name@example.com.') =>
  (value) =>
    value && !EMAIL.test(value.trim()) ? message : '';

export const PASSWORD_RULES = [
  ['8 or more characters', (value) => value.length >= 8],
  ['A number', (value) => /\d/.test(value)],
  ['A symbol', (value) => /[^A-Za-z0-9]/.test(value)],
];

export const strongPassword =
  (message = 'Use at least 8 characters with a number and a symbol.') =>
  (value) =>
    value && !PASSWORD_RULES.every(([, test]) => test(value)) ? message : '';

export const checked =
  (message = 'Tick the box to continue.') =>
  (value) =>
    value ? '' : message;

export function validate(values, rules) {
  const errors = {};
  for (const [name, checks] of Object.entries(rules)) {
    const message = [checks].flat().reduce((found, check) => found || check(values[name], values), '');
    if (message) errors[name] = message;
  }
  return errors;
}
