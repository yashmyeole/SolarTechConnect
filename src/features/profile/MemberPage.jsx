import { Navigate, useParams } from 'react-router';
import NotFoundPage from '@/features/errors/NotFoundPage';
import { usePageTitle } from '@/lib/usePageTitle';
import { useAppStore } from '@/store';
import { memberProfile, ownProfile } from './profileData';
import ProfileView from './ProfileView';

export default function MemberPage() {
  const { memberId } = useParams();
  const role = useAppStore((state) => state.role);
  const profiles = useAppStore((state) => state.profiles);
  const licenses = useAppStore((state) => state.licenses);
  const availability = useAppStore((state) => state.availability);
  const isProfessionalPersona = memberId === profiles.pro.id;
  const profile = isProfessionalPersona
    ? ownProfile(profiles.pro, licenses, availability)
    : memberProfile(memberId, profiles);
  usePageTitle(profile?.name ?? 'Profile');

  if (isProfessionalPersona && role === 'pro') return <Navigate to="/profile" replace />;
  if (!profile) return <NotFoundPage />;
  return <ProfileView profile={profile} showActions={memberId !== profiles[role]?.id} />;
}
