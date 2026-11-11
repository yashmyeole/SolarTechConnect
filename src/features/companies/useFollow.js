import { useAppStore } from '@/store';
import { toast } from '@/store/ui';

export function useFollow(company) {
  const following = useAppStore((state) => state.followingCompanyIds.includes(company.id));
  const toggle = () => {
    const now = useAppStore.getState().toggleFollow(company.id);
    toast(now ? `You’re following ${company.name}` : `You stopped following ${company.name}`);
  };
  return [following, toggle];
}
