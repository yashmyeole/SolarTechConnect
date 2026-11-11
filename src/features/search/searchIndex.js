import { JOBS } from '@/data/jobs';
import { MEMBERS } from '@/data/people';
import { OWN_COMPANY_PATH } from '@/layouts/navigation';
import { formatPay } from '@/lib/format';

const page = (to, label) => ({ type: 'page', to, label });

const PAGES = {
  visitor: [
    page('/jobs', 'Find jobs'),
    page('/companies', 'Companies'),
    page('/community', 'Events and courses'),
    page('/signin', 'Sign in'),
    page('/join', 'Join'),
    page('/help', 'Help'),
  ],
  pro: [
    page('/home', 'Home'),
    page('/jobs', 'Jobs'),
    page('/jobs/applied', 'Applications'),
    page('/jobs/saved', 'Saved jobs'),
    page('/people', 'People'),
    page('/community', 'Community'),
    page('/profile', 'Your profile'),
  ],
  emp: [
    page('/employer', 'Overview'),
    page('/employer/jobs', 'Jobs'),
    page('/employer/jobs/new', 'Post a job'),
    page('/employer/candidates', 'Candidates'),
    page('/employer/talent', 'Find talent'),
    page(OWN_COMPANY_PATH, 'Company page'),
  ],
  account: [
    page('/messages', 'Messages'),
    page('/notifications', 'Notifications'),
    page('/settings', 'Settings'),
    page('/settings/security', 'Change password'),
    page('/settings/notifications', 'Notification settings'),
    page('/help', 'Help'),
  ],
};

const RECENT = [
  { type: 'recent', to: '/jobs?q=installer', label: 'installer', detail: 'Job search · Chicago, IL' },
  { type: 'recent', to: '/jobs?q=crew+lead', label: 'crew lead', detail: 'Job search' },
];

const matches = (query, ...fields) => fields.join(' ').toLowerCase().includes(query);

export function searchGroups(rawQuery, role, companies) {
  const query = rawQuery.trim().toLowerCase();
  const pages = role ? [...PAGES[role], ...PAGES.account] : PAGES.visitor;

  if (!query) {
    return [
      { title: 'Recent', items: RECENT },
      { title: 'Go to', items: pages.slice(0, 5) },
    ];
  }

  const companyName = (id) => companies[id].name;
  const groups = [
    {
      title: 'Jobs',
      items: JOBS.filter((job) => matches(query, job.title, companyName(job.companyId)))
        .slice(0, 4)
        .map((job) => ({
          type: 'job',
          to: `/jobs/${job.id}`,
          label: job.title,
          detail: `${companyName(job.companyId)} · ${job.city} · ${formatPay(job)}`,
          avatar: { name: companyName(job.companyId), company: true },
        })),
    },
    {
      title: 'People',
      items: role
        ? MEMBERS.filter((member) => matches(query, member.name, member.headline))
            .slice(0, 3)
            .map((member) => ({
              type: 'member',
              to: `/members/${member.id}`,
              label: member.name,
              detail: member.headline,
              avatar: { name: member.name },
            }))
        : [],
    },
    {
      title: 'Companies',
      items: Object.values(companies)
        .filter((company) => matches(query, company.name, company.kind))
        .slice(0, 3)
        .map((company) => ({
          type: 'company',
          to: `/companies/${company.id}`,
          label: company.name,
          detail: company.kind,
          avatar: { name: company.name, company: true },
        })),
    },
    { title: 'Pages and settings', items: pages.filter((entry) => matches(query, entry.label)).slice(0, 4) },
    {
      title: 'Search',
      items: [
        {
          type: 'query',
          to: `/jobs?q=${encodeURIComponent(rawQuery.trim())}`,
          label: `Search jobs for “${rawQuery.trim()}”`,
        },
      ],
    },
  ];
  return groups.filter((group) => group.items.length);
}
