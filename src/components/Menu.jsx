import { createContext, useCallback, useContext, useEffect, useId, useRef, useState } from 'react';
import { Link } from 'react-router';
import { cx } from '@/lib/cx';
import Icon from './Icon';
import styles from './Menu.module.css';

const MenuContext = createContext(() => {});

const WIDTH = 256;

function place(popover, trigger, placement) {
  const rect = trigger.getBoundingClientRect();
  const style = popover.style;
  if (placement === 'top-start') {
    style.left = `${Math.max(8, rect.left)}px`;
    style.top = 'auto';
    style.bottom = `${innerHeight - rect.top + 6}px`;
  } else {
    style.left = `${Math.max(8, Math.min(rect.right - WIDTH, innerWidth - WIDTH - 8))}px`;
    style.top = `${rect.bottom + 4}px`;
    style.bottom = 'auto';
  }
}

export function Menu({ label, trigger, placement = 'bottom-end', sheet = false, wide = false, children }) {
  const id = useId();
  const popoverRef = useRef(null);
  const triggerRef = useRef(null);
  const [open, setOpen] = useState(false);

  const close = useCallback(() => popoverRef.current?.hidePopover(), []);

  useEffect(() => {
    const popover = popoverRef.current;
    const onBeforeToggle = (event) => {
      if (event.newState === 'open' && !sheet) place(popover, triggerRef.current, placement);
    };
    const onToggle = (event) => {
      const isOpen = event.newState === 'open';
      setOpen(isOpen);
      if (isOpen) popover.querySelector('[role="menuitem"]')?.focus({ preventScroll: true });
    };
    popover.addEventListener('beforetoggle', onBeforeToggle);
    popover.addEventListener('toggle', onToggle);
    return () => {
      popover.removeEventListener('beforetoggle', onBeforeToggle);
      popover.removeEventListener('toggle', onToggle);
    };
  }, [placement, sheet]);

  useEffect(() => {
    if (!open || sheet) return;
    const onScroll = () => close();
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    return () => {
      removeEventListener('scroll', onScroll);
      removeEventListener('resize', onScroll);
    };
  }, [open, sheet, close]);

  const onKeyDown = (event) => {
    const items = [...popoverRef.current.querySelectorAll('[role="menuitem"]')];
    const index = items.indexOf(document.activeElement);
    const next = { ArrowDown: index + 1, ArrowUp: index - 1, Home: 0, End: items.length - 1 }[event.key];
    if (next === undefined || !items.length) return;
    event.preventDefault();
    items[(next + items.length) % items.length].focus();
  };

  return (
    <>
      {trigger({
        ref: triggerRef,
        popoverTarget: id,
        'aria-haspopup': 'menu',
        'aria-expanded': open,
        'aria-controls': id,
      })}
      <div
        ref={popoverRef}
        id={id}
        popover="auto"
        role="menu"
        aria-label={label}
        className={cx(styles.menu, sheet && styles.sheet, wide && styles.wide)}
        onKeyDown={onKeyDown}
      >
        {sheet && <div className={styles.grab} aria-hidden="true" />}
        <MenuContext value={close}>{children}</MenuContext>
      </div>
    </>
  );
}

export function MenuItem({ icon, to, onSelect, children }) {
  const close = useContext(MenuContext);
  const content = (
    <>
      {icon && <Icon name={icon} size={18} />}
      {children}
    </>
  );
  if (to) {
    return (
      <Link
        role="menuitem"
        className={styles.item}
        to={to}
        onClick={() => {
          onSelect?.();
          close();
        }}
      >
        {content}
      </Link>
    );
  }
  return (
    <button
      type="button"
      role="menuitem"
      className={styles.item}
      onClick={() => {
        close();
        onSelect?.();
      }}
    >
      {content}
    </button>
  );
}

export function MenuDivider() {
  return <hr className={styles.divider} />;
}

export function MenuHeader({ children }) {
  return <div className={styles.header}>{children}</div>;
}

export function MenuLabel({ children }) {
  return <p className={styles.label}>{children}</p>;
}
