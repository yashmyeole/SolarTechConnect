import { COMPANIES, OWN_COMPANY_ID } from '@/data/companies';
import { findMember } from '@/data/people';
import { PERSONAS, PRO_PROFILE } from '@/data/personas';

const hashName = (name) => [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0);

function availabilitySummary({ start, types, distance }) {
  const kinds = types.map((type, index) => (index ? type.toLowerCase() : type)).join(' or ');
  const reach = distance.startsWith('Up to') ? distance.replace('Up to', 'Within') : 'Travels for projects';
  return [start, kinds, reach].filter(Boolean).join(' · ');
}

export function ownProfile(persona, licenses, availability) {
  return {
    ...PRO_PROFILE,
    id: persona.id,
    name: persona.name,
    headline: persona.headline,
    city: persona.city,
    email: persona.email,
    available: availability.open,
    availability: availabilitySummary(availability),
    licenses,
  };
}

const EMPLOYER_CONTACT = {
  id: PERSONAS.emp.id,
  name: PERSONAS.emp.name,
  headline: PERSONAS.emp.headline,
  companyId: OWN_COMPANY_ID,
  city: 'Chicago, IL',
  miles: 5,
  certifications: [],
  trade: 'Talent acquisition',
  available: false,
  experience: '8 years',
};

export function memberProfile(id, profiles) {
  const member = findMember(id) ?? (id === PERSONAS.emp.id ? { ...EMPLOYER_CONTACT, name: profiles.emp.name } : null);
  if (!member) return null;
  const company = member.companyId && COMPANIES[member.companyId];
  return {
    id: member.id,
    name: member.name,
    headline: member.headline,
    city: member.city,
    contacts: 120 + (hashName(member.name) % 300),
    available: member.available,
    availability: `${member.trade} roles · Within ${member.miles > 60 ? 100 : 50} miles`,
    about: `${member.trade} with ${member.experience} in solar, based in ${member.city}.`,
    experience: [
      {
        title: member.trade === 'Designer' ? 'PV System Designer' : member.trade,
        company: company ? company.name : 'Independent',
        type: 'Full-time',
        dates: '2023 – now',
        place: member.city,
        summary: '',
      },
    ],
    training: [{ school: 'Lakeshore Training Center', program: 'Solar training program', years: '2022' }],
    licenses: member.certifications.map((name) => ({ certification: name, name, issuer: '', date: '' })),
    skills: [
      ['Safety', 8],
      [member.trade, 5],
    ],
  };
}
