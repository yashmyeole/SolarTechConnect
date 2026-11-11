export const EMPLOYER_JOBS = [
  {
    id: 5,
    title: 'Crew Lead, Commercial Rooftop',
    location: 'Chicago, IL',
    status: 'open',
    applicants: 7,
    newApplicants: 2,
    views: 312,
    date: 'Nov 5',
    pipeline: [2, 3, 1, 1],
  },
  {
    id: 1,
    title: 'Solar Installer',
    location: 'Chicago, IL',
    status: 'open',
    applicants: 14,
    newApplicants: 6,
    views: 540,
    date: 'Nov 7',
    pipeline: [6, 5, 3, 0],
  },
  {
    id: 7,
    title: 'PV System Designer',
    location: 'Illinois (remote)',
    status: 'open',
    applicants: 19,
    newApplicants: 4,
    views: 688,
    date: 'Nov 1',
    pipeline: [4, 9, 5, 1],
  },
  {
    id: 101,
    title: 'Project Coordinator',
    location: 'Chicago, IL',
    status: 'draft',
    applicants: 0,
    newApplicants: 0,
    views: 0,
    date: 'Nov 6',
    pipeline: [0, 0, 0, 0],
  },
  {
    id: 102,
    title: 'Solar Installer (spring 2026)',
    location: 'Chicago, IL',
    status: 'closed',
    applicants: 42,
    newApplicants: 0,
    views: 1906,
    date: 'Mar 2',
    pipeline: [0, 0, 0, 0],
  },
];

const FIRST_NOTE = { authorId: 'priya-nair', text: 'Strong rooftop experience. Worth a call.', date: 'Nov 8' };

const candidate = (memberId, stage, miles, appliedOn, start) => ({
  memberId,
  stage,
  miles,
  appliedOn,
  answers: { transport: 'Yes', start },
  notes: [FIRST_NOTE],
});

export const CANDIDATES = [
  candidate('hannah-kowalski', 0, 38, 'Nov 9', 'Dec 1'),
  candidate('jorge-mendez', 0, 8, 'Nov 9', 'Immediately'),
  candidate('marcus-lee', 1, 82, 'Nov 7', 'Jan 4'),
  candidate('tom-okafor', 1, 28, 'Nov 6', 'Dec 14'),
  candidate('lena-fischer', 2, 160, 'Nov 5', 'Jan 11'),
  candidate('deshawn-carter', 3, 34, 'Nov 3', 'Dec 15'),
];

export const TEAM = [
  { name: 'Aisha Rahman', role: 'Admin', lastActive: 'Now', isYou: true },
  { name: 'Priya Nair', role: 'Hiring manager', lastActive: 'Yesterday' },
  { name: 'Mark Delgado', role: 'Interviewer', lastActive: 'Nov 3' },
];

export const MONTHLY_INVITES = 25;
