import { useRef } from 'react';
import { cx } from '@/lib/cx';
import styles from '../auth.module.css';

const LENGTH = 6;

export default function CodeInput({ value, onChange, labelledBy, describedBy, invalid }) {
  const refs = useRef([]);
  const digits = Array.from({ length: LENGTH }, (_, index) => value[index] ?? '');

  const setDigit = (index, digit) => {
    const next = [...digits];
    next[index] = digit;
    onChange(next.join(''));
  };

  const onInput = (index, event) => {
    const digit = event.target.value.replace(/\D/g, '').slice(-1);
    setDigit(index, digit);
    if (digit) refs.current[index + 1]?.focus();
  };

  const onKeyDown = (index, event) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      event.preventDefault();
      setDigit(index - 1, '');
      refs.current[index - 1].focus();
    }
  };

  const onPaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, LENGTH);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    refs.current[Math.min(pasted.length, LENGTH - 1)].focus();
  };

  return (
    <div
      className={cx(styles.code, invalid && styles.codeInvalid)}
      role="group"
      aria-labelledby={labelledBy}
      aria-describedby={describedBy}
    >
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(element) => {
            refs.current[index] = element;
          }}
          id={index === 0 ? 'code' : undefined}
          name={index === 0 ? 'code' : undefined}
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          aria-label={`Digit ${index + 1}`}
          aria-invalid={invalid || undefined}
          value={digit}
          onChange={(event) => onInput(index, event)}
          onKeyDown={(event) => onKeyDown(index, event)}
          onPaste={onPaste}
        />
      ))}
    </div>
  );
}
