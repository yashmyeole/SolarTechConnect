import styles from './DateBadge.module.css';

export default function DateBadge({ month, day }) {
  return (
    <div className={styles.badge} aria-hidden="true">
      <div className={styles.month}>{month}</div>
      <div className={styles.day}>{day}</div>
    </div>
  );
}
