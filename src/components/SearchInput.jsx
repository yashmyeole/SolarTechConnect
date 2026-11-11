import { cx } from '@/lib/cx';
import Icon from './Icon';
import styles from './SearchInput.module.css';

export default function SearchInput({ label, icon = 'search', className, ...input }) {
  return (
    <label className={cx(styles.box, className)}>
      <Icon name={icon} size={18} />
      <span className="sr-only">{label}</span>
      <input className={styles.input} placeholder={label} {...input} />
    </label>
  );
}
