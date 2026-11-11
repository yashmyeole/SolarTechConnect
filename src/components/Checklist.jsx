import { cx } from '@/lib/cx';
import Icon from './Icon';
import styles from './Checklist.module.css';

const MARK = { ok: 'check', hold: 'clock' };

export default function Checklist({ items, className }) {
  return (
    <ul className={cx(styles.list, className)}>
      {items.map(({ status, label }) => (
        <li key={label} className={styles[status]}>
          <span className={styles.mark}>{MARK[status] && <Icon name={MARK[status]} size={13} stroke={2.4} />}</span>
          <span>{label}</span>
        </li>
      ))}
    </ul>
  );
}
