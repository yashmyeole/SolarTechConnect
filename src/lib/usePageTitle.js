import { useEffect } from 'react';

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} · Solar Tech Connect` : 'Solar Tech Connect';
  }, [title]);
}
