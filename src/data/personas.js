export const DEMO_PASSWORD = 'Demo#2026';

export const PERSONAS = {
  pro: {
    id: 'maria-alvarez',
    name: 'Maria Alvarez',
    headline: 'PV Installer at Brightline Solar · Rooftop and ground-mount',
    city: 'Chicago, Illinois',
    email: 'maria@example.com',
    phone: '(555) 555-0142',
    trade: 'PV Installer',
  },
  emp: {
    id: 'aisha-rahman',
    name: 'Aisha Rahman',
    headline: 'Talent Lead at Prairie Sun EPC',
    city: 'Chicago, Illinois',
    email: 'aisha@prairiesun.example',
    phone: '(555) 555-0187',
    companyId: 'prairie-sun-epc',
  },
};

export const ROLE_LABEL = { pro: 'Professional', emp: 'Employer' };

export const PRO_PROFILE = {
  contacts: 86,
  about:
    'Three years on residential and commercial rooftops around Chicago. I like clean wire management and crews that look out for each other. Working toward my NABCEP PV Installation Professional. Fluent in English and Spanish.',
  photos: [
    { tone: 'roof', title: '412 kW commercial rooftop', caption: 'Aurora, IL · 2026' },
    { tone: 'dawn', title: '9.6 kW home array', caption: 'Naperville, IL · 2025' },
    { tone: 'canopy', title: 'Carport canopy', caption: 'Joliet, IL · 2025' },
  ],
  experience: [
    {
      title: 'PV Installer',
      company: 'Brightline Solar',
      type: 'Full-time',
      dates: 'Mar 2024 – now · 2 yrs 9 mos',
      place: 'Aurora, Illinois',
      summary: 'Residential and small commercial rooftops. Second on a five-person crew; trained four new installers.',
    },
    {
      title: 'Installer Trainee',
      company: 'Lakeshore Training Center',
      type: 'Apprenticeship',
      dates: 'Sep 2023 – Feb 2024 · 6 mos',
      place: 'Gary, Indiana',
      summary: '',
    },
  ],
  training: [{ school: 'Lakeshore Training Center', program: 'Solar PV Installer certificate', years: '2023 – 2024' }],
  licenses: [
    {
      certification: 'OSHA 10',
      name: 'OSHA 10-Hour Construction',
      issuer: 'OTI Education Center',
      date: 'Issued Mar 2024',
    },
    { certification: 'NABCEP PV Associate', name: 'NABCEP PV Associate', issuer: 'NABCEP', date: 'Expires Aug 2027' },
    { certification: 'NCCER Core', name: 'NCCER Core', issuer: 'NCCER', date: 'Issued Jun 2024' },
    {
      certification: 'First aid and CPR',
      name: 'First Aid and CPR',
      issuer: 'American Red Cross',
      date: 'Expires Jan 2027',
    },
  ],
  skills: [
    ['Module installation', 15],
    ['Racking and mounting', 12],
    ['Fall protection', 11],
    ['DC wiring', 9],
    ['Crew training', 6],
  ],
  languages: 'English and Spanish',
  reference: {
    memberId: 'deshawn-carter',
    quote:
      'Maria is the installer I want next to me on a steep roof. Careful, quick, and she trains the new people without being asked.',
    context: 'Journeyman Electrician · Worked together at Brightline Solar',
  },
  availability: {
    open: true,
    roles: 'PV Installer, Crew Lead',
    types: ['Full-time', 'Contract'],
    distance: 'Up to 50 miles',
    start: 'From December 1',
  },
};
