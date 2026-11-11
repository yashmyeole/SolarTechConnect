import { useShallow } from 'zustand/react/shallow';
import { OWN_COMPANY_ID } from '@/data/companies';
import { useAppStore } from '@/store';

const item = (to, label, icon, extra = {}) => ({ to, label, icon, ...extra });

export const OWN_COMPANY_PATH = `/companies/${OWN_COMPANY_ID}`;

export const APP_NAV = {
  pro: [
    item('/home', 'Home', 'home'),
    item('/jobs', 'Jobs', 'briefcase'),
    item('/people', 'People', 'users', { also: ['/members'] }),
    item('/messages', 'Messages', 'chat', { count: 'messages' }),
    item('/community', 'Community', 'group'),
    item('/notifications', 'Notifications', 'bell', { count: 'notifications' }),
  ],
  emp: [
    item('/employer', 'Overview', 'grid', { exact: true }),
    item('/employer/jobs', 'Jobs', 'briefcase'),
    item('/employer/candidates', 'Candidates', 'clipboard', { count: 'candidates' }),
    item('/employer/talent', 'Find talent', 'search', { also: ['/members'] }),
    item('/messages', 'Messages', 'chat', { count: 'messages' }),
    item(OWN_COMPANY_PATH, 'Company page', 'building'),
    item('/notifications', 'Notifications', 'bell', { count: 'notifications' }),
  ],
};

export const BOTTOM_NAV = {
  pro: APP_NAV.pro.slice(0, 4),
  emp: [...APP_NAV.emp.slice(0, 3), APP_NAV.emp[4]],
};

export const PUBLIC_NAV = [
  item('/jobs', 'Find jobs'),
  item('/companies', 'Companies'),
  item('/community', 'Events and courses'),
];

const under = (pathname, prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`);

export const isActive = (pathname, entry) =>
  entry.exact
    ? pathname === entry.to
    : under(pathname, entry.to) || (entry.also ?? []).some((prefix) => under(pathname, prefix));

export function useNavCounts() {
  return useAppStore(
    useShallow((state) => {
      const role = state.role ?? 'pro';
      return {
        messages: state.threads[role].filter((thread) => thread.unread).length,
        notifications: state.notifications[role].filter((entry) => entry.unread).length,
        candidates: state.employer.candidates.filter((candidate) => candidate.stage === 0).length,
      };
    }),
  );
}
