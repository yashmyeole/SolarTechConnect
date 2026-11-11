import { useMemo } from 'react';
import { findMember } from '@/data/people';
import { useAppStore } from '@/store';

const fromPersona = (persona) => ({
  id: persona.id,
  name: persona.name,
  headline: persona.headline.split(' · ')[0],
  city: persona.city,
  persona: true,
});

export function useDirectory() {
  const profiles = useAppStore((state) => state.profiles);
  const companies = useAppStore((state) => state.companies);
  return useMemo(() => {
    const personas = Object.values(profiles).map(fromPersona);
    return {
      member: (id) => findMember(id) ?? personas.find((persona) => persona.id === id),
      company: (id) => companies[id],
      companies,
    };
  }, [profiles, companies]);
}
