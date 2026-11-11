import { createBrowserRouter } from 'react-router';
import RouteError from '@/features/errors/RouteError';
import Frame from '@/layouts/Frame';
import { PublicOnly, RequireRole, SignOut } from '@/layouts/guards';
import RootLayout from '@/layouts/RootLayout';
import SiteLayout from '@/layouts/SiteLayout';

const page = (load) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    Component: RootLayout,
    ErrorBoundary: RouteError,
    HydrateFallback: () => null,
    children: [
      { path: 'signout', Component: SignOut },
      {
        Component: PublicOnly,
        children: [
          { index: true, lazy: page(() => import('@/features/landing/LandingPage')) },
          {
            Component: SiteLayout,
            children: [
              { path: 'signin', lazy: page(() => import('@/features/auth/SignInPage')) },
              { path: 'join/:role?', lazy: page(() => import('@/features/auth/JoinPage')) },
            ],
          },
        ],
      },
      {
        Component: Frame,
        children: [
          { path: 'jobs/:jobId?', lazy: page(() => import('@/features/jobs/JobSearchPage')) },
          { path: 'companies', lazy: page(() => import('@/features/companies/CompaniesPage')) },
          { path: 'companies/:companyId/:tab?', lazy: page(() => import('@/features/companies/CompanyPage')) },
          { path: 'community/:tab?', lazy: page(() => import('@/features/community/CommunityPage')) },
          { path: 'help', lazy: page(() => import('@/features/help/HelpPage')) },
          {
            element: <RequireRole roles={['pro']} />,
            children: [
              { path: 'home', lazy: page(() => import('@/features/home/HomePage')) },
              { path: 'jobs/saved', lazy: page(() => import('@/features/jobs/SavedJobsPage')) },
              { path: 'jobs/applied', lazy: page(() => import('@/features/jobs/ApplicationsPage')) },
              { path: 'profile', lazy: page(() => import('@/features/profile/ProfilePage')) },
              { path: 'people/:tab?', lazy: page(() => import('@/features/people/PeoplePage')) },
            ],
          },
          {
            element: <RequireRole roles={['pro', 'emp']} />,
            children: [
              { path: 'members/:memberId', lazy: page(() => import('@/features/profile/MemberPage')) },
              { path: 'messages/:threadId?', lazy: page(() => import('@/features/messages/MessagesPage')) },
              { path: 'notifications', lazy: page(() => import('@/features/notifications/NotificationsPage')) },
              { path: 'settings/:section?', lazy: page(() => import('@/features/settings/SettingsPage')) },
            ],
          },
          {
            path: 'employer',
            element: <RequireRole roles={['emp']} />,
            children: [
              { index: true, lazy: page(() => import('@/features/employer/OverviewPage')) },
              { path: 'jobs/new', lazy: page(() => import('@/features/employer/PostJobPage')) },
              { path: 'jobs/:status?', lazy: page(() => import('@/features/employer/EmployerJobsPage')) },
              { path: 'candidates', lazy: page(() => import('@/features/employer/CandidatesPage')) },
              { path: 'talent', lazy: page(() => import('@/features/employer/TalentPage')) },
            ],
          },
          { path: '*', lazy: page(() => import('@/features/errors/NotFoundPage')) },
        ],
      },
    ],
  },
]);
