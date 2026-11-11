import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import { ownProfile } from './profileData';
import ProfileView from './ProfileView';

export default function ProfilePage() {
  usePageTitle('Your profile');
  const persona = useAppStore((state) => state.profiles.pro);
  const licenses = useAppStore((state) => state.licenses);
  const availability = useAppStore((state) => state.availability);
  return <ProfileView profile={ownProfile(persona, licenses, availability)} own />;
}
