import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import styles from './Button.module.css';

const buttonClass = ({ variant, size = 'md', iconOnly, block, on, className }) =>
  cx(
    styles.button,
    styles[variant ?? (iconOnly ? 'plain' : 'secondary')],
    styles[size],
    iconOnly && styles.iconOnly,
    block && styles.block,
    on && styles.on,
    className,
  );

export function Button({ variant, size, iconOnly, block, on, className, type = 'button', ...props }) {
  return <button type={type} className={buttonClass({ variant, size, iconOnly, block, on, className })} {...props} />;
}

export function ButtonLink({ variant, size, iconOnly, block, on, className, ...props }) {
  return <Link className={buttonClass({ variant, size, iconOnly, block, on, className })} {...props} />;
}
