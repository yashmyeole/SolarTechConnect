export const RAIL_LINKS = [
  ['top', 'Start'],
  ['mission', 'Why we exist'],
  ['who', 'Who it’s for'],
  ['pathway', 'Classroom to rooftop'],
  ['partners', 'Partners'],
  ['join', 'Join'],
];

export const STATEMENT =
  'Clean energy needs more than panels. It needs trained people, employers they can trust, and a clear path between the two. Solar Tech Connect is that path: workforce infrastructure for the people who build solar.';

export const DOORS = [
  {
    kicker: 'For professionals',
    title: 'Find work that fits your trade',
    ticks: [
      'See pay, distance and start date before you apply',
      'Show your work: photos, licenses and references on one profile',
      'Follow every application from applied to offer',
      'Train toward OSHA, NCCER and NABCEP with our partners',
    ],
    action: { to: '/join/professional', label: 'Create your profile', variant: 'plum' },
    note: 'No upfront cost',
  },
  {
    kicker: 'For employers',
    title: 'Build crews you can count on',
    ticks: [
      'Post a job in minutes, with pay and schedule up front',
      'Review candidates by stage, as a list or a board',
      'Find people near your sites by trade and availability',
      'Carry the Verified employer mark on every job',
    ],
    action: { to: '/join/employer', label: 'Start hiring', variant: 'line' },
    note: 'One quick business check when you join',
    employer: true,
  },
];

export const FACTS = [
  ['37%', 'projected growth in solar installer jobs, 2025 to 2035', 'U.S. Bureau of Labor Statistics'],
  ['280,000+', 'people already work in U.S. solar', '2025 U.S. Energy and Employment Report'],
  ['86%', 'of solar employers say roles are hard to fill', '2025 U.S. Energy and Employment Report'],
];

export const FACT_SOURCES = [
  {
    label: 'BLS Occupational Outlook Handbook',
    href: 'https://www.bls.gov/ooh/construction-and-extraction/solar-photovoltaic-installers.htm',
    note: 'updated August 2026',
  },
  {
    label: 'pv magazine',
    href: 'https://www.pv-magazine.com/2026/04/02/us-solar-faces-53000-worker-gap-ahead-of-2026-deadline',
    note: 'April 2026',
  },
];

export const STEPS = [
  {
    title: 'Train',
    short: 'Train',
    text: 'Hands-on labs and VR practice with JIREH Workforce Solutions and Ecademy. The Chicago program runs 450 hours.',
    video: '',
  },
  {
    title: 'Earn credentials',
    short: 'Credentials',
    text: 'OSHA, NCCER and NABCEP training prepares you for the cards employers ask for. Add each one to your profile as you earn it.',
    video: '',
  },
  {
    title: 'Get matched',
    short: 'Match',
    text: 'Tell us your trade, how far you travel and when you can start. Matching brings the right jobs to you and the right people to employers.',
    video: '',
  },
  {
    title: 'Grow',
    short: 'Grow',
    text: 'References from crew leads, new skills, bigger sites. Your profile grows with every job.',
    video: '',
  },
];

export const PARTNERS = [
  'JIREH Workforce Solutions',
  'Ecademy',
  'Summit Ridge Energy',
  'BITHENERGY',
  'Cortese Energy',
  'GreenTech',
];

export const TRAINING_CENTER = {
  stats: [
    ['450', 'hours of instruction'],
    ['10,000', 'square feet of labs and classrooms'],
    ['25', 'seats in each cohort'],
  ],
  source: {
    label: 'Chicago Sun-Times',
    href: 'https://chicago.suntimes.com/work/2026/08/22/near-west-side-jireh-nonprofit-job-training-lessons-solar-panels',
    note: 'August 2026',
  },
};

export const ROADMAP = [
  ['VR practice modules', 'Rehearse an install in a headset before you climb a roof.'],
  ['Smarter matching', 'Matching that weighs trade, distance, availability and credentials.'],
  ['Beyond solar', 'Storage, EV charging and HVAC roles as the network grows.'],
];

export const FOOTER_COLUMNS = [
  {
    title: 'Professionals',
    links: [
      { to: '/jobs', label: 'Find solar work' },
      { to: '/community', label: 'Events and courses' },
      { to: '/join/professional', label: 'Create a profile' },
    ],
  },
  {
    title: 'Employers',
    links: [
      { to: '/join/employer', label: 'Start hiring' },
      { to: '/companies', label: 'Companies' },
      { section: 'partners', label: 'Partners' },
    ],
  },
];
