import { cx } from '@/lib/cx';
import Icon from './Icon';
import styles from './Note.module.css';

const ICON = { info: 'info', warn: 'clock', ok: 'shield' };

export default function Note({ tone, icon, action, className, children }) {
  const iconName = icon ?? ICON[tone];
  return (
    <div className={cx(styles.note, tone && styles[tone], className)}>
      {iconName && <Icon name={iconName} className={styles.icon} />}
      <div className="grow">{children}</div>
      {action}
    </div>
  );
}
