import { useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import styles from './Segmented.module.css';

function useActiveInView(selector, active) {
  const ref = useRef(null);
  useEffect(() => {
    const box = ref.current;
    const item = box.querySelector(selector);
    if (!item || box.scrollWidth <= box.clientWidth) return;
    const bounds = box.getBoundingClientRect();
    const { left, right } = item.getBoundingClientRect();
    if (left < bounds.left) box.scrollLeft += left - bounds.left - 12;
    else if (right > bounds.right) box.scrollLeft += right - bounds.right + 12;
  }, [selector, active]);
  return ref;
}

const Count = ({ value }) => (value == null ? null : <span className={styles.count}>{value}</span>);

export function Segmented({ label, items, value, onChange, small }) {
  const ref = useActiveInView('[aria-pressed="true"]', value);
  return (
    <div ref={ref} className={cx(styles.segmented, small && styles.small)} role="group" aria-label={label}>
      {items.map((item) => (
        <button key={item.value} type="button" aria-pressed={item.value === value} onClick={() => onChange(item.value)}>
          {item.label}
          <Count value={item.count} />
        </button>
      ))}
    </div>
  );
}

export function SegmentedNav({ label, items, current }) {
  const ref = useActiveInView('[aria-current="page"]', current);
  return (
    <nav ref={ref} className={styles.segmented} aria-label={label}>
      {items.map((item) => (
        <Link
          key={item.value}
          to={item.to}
          replace
          preventScrollReset
          aria-current={item.value === current ? 'page' : undefined}
        >
          {item.label}
          <Count value={item.count} />
        </Link>
      ))}
    </nav>
  );
}
