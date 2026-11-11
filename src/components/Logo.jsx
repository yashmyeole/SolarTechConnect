import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import styles from './Logo.module.css';

export function LogoMark({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true" focusable="false">
      <circle cx="20" cy="20" r="14" fill="none" stroke="#2f6db5" strokeWidth="8" strokeDasharray="5.5 2.2" />
      <path d="M20 6a14 14 0 0 1 14 14" fill="none" stroke="#e05a2b" strokeWidth="8" strokeDasharray="5.5 2.2" />
    </svg>
  );
}

export default function Logo({ to, compact = false, className }) {
  return (
    <Link to={to} className={cx(styles.logo, className)} aria-label="Solar Tech Connect home">
      <LogoMark />
      {!compact && <span className={styles.wordmark}>Solar Tech Connect</span>}
    </Link>
  );
}
