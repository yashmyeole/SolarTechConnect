import { useNavigate } from 'react-router';
import { useAppStore } from '@/store';
import { useDirectory } from './useDirectory';

export function useOpenConversation() {
  const navigate = useNavigate();
  const { member } = useDirectory();
  return (memberId) => {
    const { role, findOrStartThread } = useAppStore.getState();
    const id = findOrStartThread(role, { kind: 'member', id: memberId }, member(memberId)?.headline ?? '');
    navigate(`/messages/${id}`);
  };
}
