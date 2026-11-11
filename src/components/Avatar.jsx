import { cx } from '@/lib/cx';
import { initials } from '@/lib/format';
import styles from './Avatar.module.css';

const PERSON_COLORS = ['#dbe4ef', '#e7dfcd', '#d8e8dc', '#ebdce5', '#e3e2d1', '#d6e5e8'];
const COMPANY_COLORS = ['#2d4a6b', '#3b5a44', '#6a4636', '#474c6a', '#56632d', '#5a3f5c'];

const colorFor = (name, colors) => colors[[...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) % colors.length];

export default function Avatar({ name, size = 40, company = false, className }) {
  return (
    <span
      className={cx(styles.avatar, company && styles.company, styles[`size${size}`], className)}
      style={{ '--avatar-color': colorFor(name, company ? COMPANY_COLORS : PERSON_COLORS) }}
      aria-hidden="true"
    >
      {initials(name)}
    </span>
  );
}
