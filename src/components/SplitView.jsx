import { cx } from '@/lib/cx';
import { Button } from './Button';
import { Card } from './Card';
import Icon from './Icon';
import styles from './SplitView.module.css';

export function SplitView({ children }) {
  return <div className={styles.split}>{children}</div>;
}

export function ListPane({ title, action, children }) {
  return (
    <Card className={styles.listPane}>
      <div className={styles.listHeader}>
        {title}
        {action}
      </div>
      {children}
    </Card>
  );
}

export function PaneRow({ selected, onClick, children }) {
  return (
    <button type="button" className={styles.row} aria-current={selected} onClick={onClick}>
      {children}
    </button>
  );
}

export function RowTitle(props) {
  return <span className={styles.rowTitle} {...props} />;
}

export function RowLine(props) {
  return <span className={styles.rowLine} {...props} />;
}

export function RowMeta(props) {
  return <span className={styles.rowMeta} {...props} />;
}

export function DetailArticle({ onBack, backLabel, className, children }) {
  return (
    <article className={cx(styles.detail, className)}>
      {onBack && (
        <Button variant="quiet" size="sm" className={styles.back} onClick={onBack}>
          <Icon name="chevronLeft" size={18} />
          {backLabel}
        </Button>
      )}
      {children}
    </article>
  );
}

export function DetailSection({ className, ...props }) {
  return <section className={cx(styles.section, className)} {...props} />;
}
