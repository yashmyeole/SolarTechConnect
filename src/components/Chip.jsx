import { cx } from '@/lib/cx';
import Icon from './Icon';
import styles from './Chip.module.css';

export function Chip({ tone, className, ...props }) {
  return <span className={cx(styles.chip, tone && styles[tone], className)} {...props} />;
}

export function VerifiedMark({ size = 16 }) {
  return (
    <span className={styles.verified}>
      <Icon name="shield" size={size} />
      Verified employer
    </span>
  );
}

export function AvailableMark({ children = 'Available for work', small }) {
  return <span className={cx(styles.available, small && styles.small)}>{children}</span>;
}
