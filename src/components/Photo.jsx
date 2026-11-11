import { cx } from '@/lib/cx';
import styles from './Photo.module.css';

export default function Photo({ tone = 'roof', label = 'Sample image', className }) {
  return (
    <div className={cx(styles.photo, styles[tone], className)} role="img" aria-label={label}>
      <span className={styles.label}>{label}</span>
    </div>
  );
}
