import { useNavigate } from 'react-router';
import { homePath, useAppStore } from '@/store';
import { toast } from '@/store/ui';

export function useDemoActions() {
  const navigate = useNavigate();
  const role = useAppStore((state) => state.role);
  const verified = useAppStore((state) => state.employer.verified);

  return {
    role,
    verified,
    switchAccount: () => {
      const next = role === 'pro' ? 'emp' : 'pro';
      navigate(homePath(next));
      useAppStore.getState().signInDemo(next);
      toast(`Signed in as ${useAppStore.getState().profiles[next].name}`);
    },
    toggleVerified: () => {
      useAppStore.getState().setEmployerVerified(!verified);
      toast(verified ? 'Demo employer set to in review' : 'Demo employer set to verified');
    },
    reset: () => {
      navigate(homePath(role));
      useAppStore.getState().resetDemo();
      toast('Demo data reset');
    },
    signOut: () => navigate('/signout'),
  };
}
