import { JOBS } from '@/data/jobs';
import { EXPERIENCE } from '@/data/options';
import { hourlyRate } from '@/lib/format';

const any = (label) => ['', label];

export const FILTERS = {
  pay: {
    label: 'Pay',
    fallback: 0,
    numeric: true,
    options: [
      [0, 'Any pay'],
      [20, '$20+/hr'],
      [25, '$25+/hr'],
      [30, '$30+/hr'],
      [35, '$35+/hr'],
    ],
  },
  distance: {
    label: 'Distance',
    fallback: 50,
    numeric: true,
    options: [
      [15, 'Within 15 mi'],
      [30, 'Within 30 mi'],
      [50, 'Within 50 mi'],
      [100, 'Within 100 mi'],
      [500, 'Any distance'],
    ],
  },
  type: {
    label: 'Job type',
    fallback: '',
    options: [
      any('Any type'),
      ['Full-time', 'Full-time'],
      ['Contract', 'Contract'],
      ['Apprenticeship', 'Apprenticeship'],
    ],
  },
  experience: {
    label: 'Experience',
    fallback: '',
    options: [any('Any experience'), ...EXPERIENCE.map((level) => [level, level])],
  },
  workplace: {
    label: 'Workplace',
    fallback: '',
    options: [any('Any workplace'), ['On-site', 'On-site'], ['Remote', 'Remote']],
  },
  posted: {
    label: 'Posted',
    fallback: 0,
    numeric: true,
    options: [
      [0, 'Any time'],
      [1, 'Last 24 hours'],
      [3, 'Last 3 days'],
      [7, 'Last week'],
    ],
  },
};

export const SORTS = [
  ['new', 'Newest first'],
  ['pay', 'Highest pay'],
  ['near', 'Closest'],
];

const DEFAULT_LOCATION = 'Chicago, IL';

export function readFilters(params) {
  const filters = {
    q: params.get('q') ?? '',
    location: params.get('location') ?? DEFAULT_LOCATION,
    sort: params.get('sort') ?? 'new',
  };
  for (const [key, filter] of Object.entries(FILTERS)) {
    const raw = params.get(key);
    filters[key] = raw === null ? filter.fallback : filter.numeric ? Number(raw) : raw;
  }
  return filters;
}

export function writeFilters(filters) {
  const params = new URLSearchParams();
  if (filters.q) params.set('q', filters.q);
  if (filters.location && filters.location !== DEFAULT_LOCATION) params.set('location', filters.location);
  for (const [key, filter] of Object.entries(FILTERS)) {
    if (filters[key] !== filter.fallback) params.set(key, filters[key]);
  }
  if (filters.sort !== 'new') params.set('sort', filters.sort);
  return params;
}

export const activeFilters = (filters) => Object.keys(FILTERS).filter((key) => filters[key] !== FILTERS[key].fallback);

export const optionLabel = (key, value) => FILTERS[key].options.find(([option]) => option === value)?.[1] ?? '';

export function filterJobs(filters, companyName) {
  const query = filters.q.trim().toLowerCase();
  const matches = JOBS.filter(
    (job) =>
      (!query ||
        [job.title, companyName(job.companyId), ...job.certifications].join(' ').toLowerCase().includes(query)) &&
      (job.workplace === 'Remote' || job.miles <= filters.distance) &&
      hourlyRate(job) >= filters.pay &&
      (!filters.type || job.type === filters.type) &&
      (!filters.experience || job.experience === filters.experience) &&
      (!filters.workplace || job.workplace === filters.workplace) &&
      (!filters.posted || job.postedDaysAgo <= filters.posted),
  );
  const order = {
    pay: (a, b) => hourlyRate(b) - hourlyRate(a),
    near: (a, b) => a.miles - b.miles,
    new: (a, b) => a.postedDaysAgo - b.postedDaysAgo,
  }[filters.sort];
  return matches.sort(order);
}
