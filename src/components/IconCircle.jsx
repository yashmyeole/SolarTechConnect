import Icon from './Icon';
import styles from './IconCircle.module.css';

export default function IconCircle({ name, size = 20 }) {
  return (
    <span className={styles.circle}>
      <Icon name={name} size={size} />
    </span>
  );
}
