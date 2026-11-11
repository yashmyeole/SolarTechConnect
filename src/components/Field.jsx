import { cx } from '@/lib/cx';
import { Button } from './Button';
import Icon from './Icon';
import styles from './Field.module.css';

const describedBy = (id, hint, error) => cx(hint && `${id}-hint`, error && `${id}-error`) || undefined;

export function FieldError({ id, message }) {
  if (!message) return null;
  return (
    <p className={styles.error} id={id} role="alert">
      <Icon name="info" size={16} />
      {message}
    </p>
  );
}

export function FieldLabel({ htmlFor, id, required, optional = true, note, children }) {
  const Tag = htmlFor ? 'label' : 'span';
  return (
    <Tag htmlFor={htmlFor} id={id} className={styles.label}>
      {children}
      {required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : (
        optional && <span className={styles.optional}>{note ?? 'Optional'}</span>
      )}
    </Tag>
  );
}

function FieldShell({ id, label, required, optional, hint, error, children }) {
  return (
    <div className={cx(styles.field, error && styles.invalid)}>
      <FieldLabel htmlFor={id} required={required} optional={optional}>
        {label}
      </FieldLabel>
      {children}
      {hint && (
        <div className={styles.hint} id={`${id}-hint`}>
          {hint}
        </div>
      )}
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

const controlProps = ({ id, name, required, hint, error }) => ({
  id,
  name: name ?? id,
  required,
  'aria-invalid': error ? true : undefined,
  'aria-describedby': describedBy(id, hint, error),
});

export function TextField({ id, name, label, required, optional, hint, error, className, ...input }) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error}>
      <input
        className={cx(styles.input, className)}
        {...controlProps({ id, name, required, hint, error })}
        {...input}
      />
    </FieldShell>
  );
}

export function TextAreaField({ id, name, label, required, optional, hint, error, className, ...input }) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error}>
      <textarea
        className={cx(styles.input, styles.textarea, className)}
        {...controlProps({ id, name, required, hint, error })}
        {...input}
      />
    </FieldShell>
  );
}

export function SelectField({
  id,
  name,
  label,
  required,
  optional,
  hint,
  error,
  options,
  placeholder = 'Select',
  ...input
}) {
  return (
    <FieldShell id={id} label={label} required={required} optional={optional} hint={hint} error={error}>
      <Select
        {...controlProps({ id, name, required, hint, error })}
        options={options}
        placeholder={placeholder}
        {...input}
      />
    </FieldShell>
  );
}

export function Select({ options, placeholder, small, className, ...props }) {
  return (
    <select className={cx(styles.input, styles.select, small && styles.small, className)} {...props}>
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((option) => {
        const { value, label } = typeof option === 'string' ? { value: option, label: option } : option;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

export function CheckboxField({ id, name, checked, onChange, error, required, children }) {
  return (
    <div>
      <label className={styles.check}>
        <input
          type="checkbox"
          id={id}
          name={name ?? id}
          checked={checked}
          onChange={onChange}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
        />
        <span>
          {children}
          {required && (
            <span className={styles.required} aria-hidden="true">
              *
            </span>
          )}
        </span>
      </label>
      <FieldError id={`${id}-error`} message={error} />
    </div>
  );
}

export function Checkbox({ label, ...input }) {
  return (
    <label className={styles.check}>
      <input type="checkbox" {...input} />
      {label}
    </label>
  );
}

export function Radio({ label, ...input }) {
  return (
    <label className={styles.check}>
      <input type="radio" {...input} />
      {label}
    </label>
  );
}

export function Switch({ className, ...input }) {
  return <input type="checkbox" role="switch" className={cx(styles.switch, className)} {...input} />;
}

export function ToggleRow({ title, description, divided, ...input }) {
  return (
    <label className={cx(styles.toggleRow, divided && styles.divided)}>
      <span>
        <span className="strong">{title}</span>
        {description && <span className="block text-sm subtle">{description}</span>}
      </span>
      <Switch aria-label={title} {...input} />
    </label>
  );
}

export function ChoiceChips({ options, selected, onToggle }) {
  return (
    <div className={styles.chips}>
      {options.map((option) => (
        <Button
          key={option}
          size="sm"
          on={selected.includes(option)}
          aria-pressed={selected.includes(option)}
          onClick={() => onToggle(option)}
        >
          {option}
        </Button>
      ))}
    </div>
  );
}

export function RequiredLegend() {
  return (
    <p className={styles.legend}>
      Fields marked <span className={styles.required}>*</span> are required.
    </p>
  );
}

export function FieldStack({ className, ...props }) {
  return <div className={cx(styles.stack, className)} {...props} />;
}

export function FieldPair(props) {
  return <div className={styles.pair} {...props} />;
}

export function OptionGroup({ legend, children }) {
  return (
    <fieldset className={styles.field}>
      <legend className={cx(styles.label, styles.legendLabel)}>{legend}</legend>
      {children}
    </fieldset>
  );
}
