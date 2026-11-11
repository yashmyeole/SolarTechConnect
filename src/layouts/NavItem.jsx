import { Link } from 'react-router';
import Icon from '@/components/Icon';
import styles from './AppLayout.module.css';

export default function NavItem({ entry, active, count }) {
  return (
    <Link to={entry.to} className={styles.navItem} aria-current={active ? 'page' : undefined} title={entry.label}>
      <Icon name={entry.icon} />
      <span className={styles.label}>{entry.label}</span>
      {count > 0 && (
        <span className={styles.count}>
          {count}
          <span className="sr-only"> new</span>
        </span>
      )}
    </Link>
  );
}
