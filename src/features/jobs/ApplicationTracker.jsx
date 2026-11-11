import { APPLICATION_STAGES } from '@/data/options';
import { cx } from '@/lib/cx';
import styles from './jobs.module.css';

export default function ApplicationTracker({ stage }) {
  return (
    <ol className={styles.tracker} aria-label={`Stage: ${APPLICATION_STAGES[stage]}`}>
      {APPLICATION_STAGES.map((label, index) => (
        <li key={label} className={cx(index < stage && styles.done, index === stage && styles.current)}>
          {label}
        </li>
      ))}
    </ol>
  );
}
