import { useEffect, useRef } from 'react';
import { useUiStore } from '@/store/ui';
import Icon from './Icon';
import styles from './Toaster.module.css';

export default function Toaster() {
  const toast = useUiStore((state) => state.toast);
  const hideToast = useUiStore((state) => state.hideToast);
  const ref = useRef(null);

  useEffect(() => {
    const region = ref.current;
    if (region.matches(':popover-open')) region.hidePopover();
    if (!toast) return;
    region.showPopover();
    const timer = setTimeout(hideToast, 3600);
    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  return (
    <>
      <div ref={ref} popover="manual" className={styles.region} aria-hidden="true">
        {toast && (
          <div className={styles.toast}>
            <Icon name="check" size={18} stroke={2.2} className={styles.icon} />
            <span>{toast.message}</span>
          </div>
        )}
      </div>
      <div className="sr-only" role="status" aria-live="polite">
        {toast?.message}
      </div>
    </>
  );
}
