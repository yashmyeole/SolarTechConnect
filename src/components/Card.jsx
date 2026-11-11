import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import styles from './Card.module.css';

export function Card({ as: Tag = 'section', padded, className, ...props }) {
  return <Tag className={cx(styles.card, padded && styles.padded, className)} {...props} />;
}

export function CardHeader({ title, action, as: Heading = 'h2', className }) {
  return (
    <div className={cx(styles.header, className)}>
      <Heading className="h3">{title}</Heading>
      {action}
    </div>
  );
}

export function CardBody({ className, ...props }) {
  return <div className={cx(styles.body, className)} {...props} />;
}

export function CardFooterLink({ to, onClick, children }) {
  return to ? (
    <Link className={styles.footer} to={to}>
      {children}
    </Link>
  ) : (
    <button type="button" className={styles.footer} onClick={onClick}>
      {children}
    </button>
  );
}
