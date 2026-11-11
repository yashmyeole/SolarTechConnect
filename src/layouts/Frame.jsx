import { useRole } from '@/store';
import AppLayout from './AppLayout';
import SiteLayout from './SiteLayout';

export default function Frame() {
  return useRole() ? <AppLayout /> : <SiteLayout />;
}
