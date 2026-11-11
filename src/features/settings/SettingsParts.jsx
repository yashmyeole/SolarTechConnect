import { Button } from '@/components/Button';
import { Card, CardHeader } from '@/components/Card';
import { Switch } from '@/components/Field';
import { cx } from '@/lib/cx';
import styles from './settings.module.css';

export function SettingsCard({ title, danger, children }) {
  return (
    <Card className={cx(danger && styles.danger)}>
      <CardHeader title={title} />
      <div className={styles.rows}>{children}</div>
    </Card>
  );
}

export function SettingRow({ label, description, value, actionLabel = 'Change', onAction, leading, children }) {
  return (
    <div className={styles.row}>
      {leading}
      <div className={styles.label}>
        {label && <b>{label}</b>}
        {description && <span>{description}</span>}
      </div>
      {value && <span className={styles.value}>{value}</span>}
      {onAction && (
        <Button variant="text" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
      {children}
    </div>
  );
}

export function SettingToggle({ label, description, checked, onChange }) {
  return (
    <label className={cx(styles.row, styles.toggle)}>
      <div className={styles.label}>
        <b>{label}</b>
        <span>{description}</span>
      </div>
      <Switch checked={checked} onChange={(event) => onChange(event.target.checked)} aria-label={label} />
    </label>
  );
}
