import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import styles from './List.module.css';

export function List({ className, ...props }) {
  return <ul className={cx(styles.list, className)} {...props} />;
}

export function ListItem({ to, onClick, top, wrap, className, children, ...props }) {
  const rowClass = cx(
    styles.row,
    top && styles.top,
    wrap && styles.wrap,
    (to || onClick) && styles.interactive,
    className,
  );
  if (to) {
    return (
      <li>
        <Link className={rowClass} to={to} {...props}>
          {children}
        </Link>
      </li>
    );
  }
  if (onClick) {
    return (
      <li>
        <button type="button" className={rowClass} onClick={onClick} {...props}>
          {children}
        </button>
      </li>
    );
  }
  return (
    <li className={rowClass} {...props}>
      {children}
    </li>
  );
}

export function SubHeading({ className, ...props }) {
  return <p className={cx(styles.subHeading, className)} {...props} />;
}
