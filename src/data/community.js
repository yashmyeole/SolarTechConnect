export const GROUPS = [
  {
    id: 'chicago-installers',
    name: 'Chicago Solar Installers',
    members: '2,140 members',
    about: 'Local installers trading tips, tool reviews and job leads.',
  },
  {
    id: 'women-in-solar',
    name: 'Women in Solar, Midwest',
    members: '860 members',
    about: 'Mentoring, meetups and open roles shared by members.',
  },
  {
    id: 'solar-electricians',
    name: 'Solar Electricians',
    members: '3,420 members',
    about: 'Code questions, inspections and commissioning.',
  },
  {
    id: 'om-storage',
    name: 'O&M and Storage Technicians',
    members: '1,105 members',
    about: 'Troubleshooting, monitoring and battery service.',
  },
  {
    id: 'new-to-solar',
    name: 'New to Solar',
    members: '4,870 members',
    about: 'Trainees, career changers and the people who hire them.',
  },
  {
    id: 'utility-travelers',
    name: 'Utility-Scale Travelers',
    members: '1,560 members',
    about: 'Per diem, lodging and which sites are hiring crews.',
  },
];

export const findGroup = (id) => GROUPS.find((group) => group.id === id);

export const EVENTS = [
  {
    id: 'installers-meetup',
    month: 'Nov',
    day: '19',
    name: 'Chicago installers meetup',
    when: 'Thursday, 6:00 pm',
    where: 'Pilsen, Chicago · Hosted by Chicago Solar Installers',
    going: 48,
  },
  {
    id: 'string-map-webinar',
    month: 'Nov',
    day: '24',
    name: 'Webinar: reading a string map',
    when: 'Tuesday, 12:00 pm',
    where: 'Online · 45 minutes',
    going: 212,
  },
  {
    id: 'hiring-day',
    month: 'Dec',
    day: '12',
    name: 'Midwest Solar Hiring Day',
    when: 'Saturday, 9:00 am',
    where: 'Aurora, IL · 14 employers attending',
    going: 306,
  },
];

export const COURSES = [
  {
    id: 'osha-30',
    name: 'OSHA 30-Hour Construction',
    providerId: 'lakeshore-training',
    format: 'In person · Gary, IN · Four weekends from Dec 5',
    leadsTo: 'OSHA 30 card',
  },
  {
    id: 'nabcep-associate-prep',
    name: 'NABCEP PV Associate exam prep',
    providerId: 'lakeshore-training',
    format: 'Online · Self-paced · About 40 hours',
    leadsTo: 'Eligibility for the PV Associate exam',
  },
  {
    id: 'nccer-pv-1',
    name: 'NCCER Solar PV Installer, Level 1',
    providerId: 'lakeshore-training',
    format: 'Evenings · 12 weeks from Jan 11',
    leadsTo: 'NCCER Solar PV Installer credential',
  },
  {
    id: 'battery-fundamentals',
    name: 'Battery storage fundamentals',
    providerId: 'lakeshore-energy',
    format: 'Online · 8 hours',
    leadsTo: 'Certificate of completion',
  },
];
