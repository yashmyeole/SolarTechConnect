import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';

export function useSectionFocus() {
  const ref = useRef(null);
  const section = useLocation().pathname.split('/')[1];
  const previous = useRef(section);

  useEffect(() => {
    if (previous.current === section) return;
    previous.current = section;
    ref.current?.focus({ preventScroll: true });
  }, [section]);

  return ref;
}
