import { useEffect, useId, useRef } from 'react';
import { cx } from '@/lib/cx';
import { Button } from './Button';
import Icon from './Icon';
import styles from './Dialog.module.css';

export function Dialog({ title, label, onClose, variant = 'modal', className, children }) {
  const ref = useRef(null);
  const returnFocus = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = ref.current;
    returnFocus.current ??= document.activeElement;
    if (!dialog.open) dialog.showModal();
    dialog.querySelector('[data-autofocus]')?.focus();
    return () => {
      if (returnFocus.current?.isConnected) returnFocus.current.focus({ preventScroll: true });
    };
  }, []);

  return (
    <dialog
      ref={ref}
      className={cx(styles.dialog, styles[variant], className)}
      aria-labelledby={title ? titleId : undefined}
      aria-label={title ? undefined : label}
      onClose={onClose}
      onClick={(event) => event.target === event.currentTarget && onClose()}
    >
      <div className={styles.surface}>
        {title && (
          <div className={styles.header}>
            <h2 className="h2" id={titleId}>
              {title}
            </h2>
            <Button iconOnly aria-label="Close" onClick={onClose}>
              <Icon name="x" />
            </Button>
          </div>
        )}
        {children}
      </div>
    </dialog>
  );
}

export function DialogBody({ className, ...props }) {
  return <div className={cx(styles.body, className)} {...props} />;
}

export function DialogFooter({ className, ...props }) {
  return <div className={cx(styles.footer, className)} {...props} />;
}

export function DialogActions({ onCancel, submitLabel, cancelLabel = 'Cancel', submitVariant = 'primary' }) {
  return (
    <DialogFooter>
      <Button variant="quiet" onClick={onCancel}>
        {cancelLabel}
      </Button>
      <Button type="submit" variant={submitVariant}>
        {submitLabel}
      </Button>
    </DialogFooter>
  );
}
