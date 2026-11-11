import { useEffect } from 'react';
import { Outlet, ScrollRestoration } from 'react-router';
import Toaster from '@/components/Toaster';
import SearchDialog from '@/features/search/SearchDialog';
import { useUiStore } from '@/store/ui';

export default function RootLayout() {
  const searchOpen = useUiStore((state) => state.searchOpen);
  const openSearch = useUiStore((state) => state.openSearch);

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        openSearch();
      }
    };
    addEventListener('keydown', onKeyDown);
    return () => removeEventListener('keydown', onKeyDown);
  }, [openSearch]);

  return (
    <>
      <Outlet />
      <ScrollRestoration />
      <Toaster />
      {searchOpen && <SearchDialog />}
    </>
  );
}
