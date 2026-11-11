import { useAppStore } from '@/store';
import { toast } from '@/store/ui';
import { DEMO_SIGNUP } from './demoSignup';

const WELCOME = {
  pro: 'Welcome to Solar Tech Connect. Your profile is live.',
  emp: 'Welcome to Solar Tech Connect. Your company page is ready.',
};

export function createAccount(role, details = DEMO_SIGNUP[role]) {
  useAppStore.getState().createAccount(role, details);
  toast(WELCOME[role]);
}
