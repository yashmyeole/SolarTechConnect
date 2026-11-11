import { COMPANIES } from '@/data/companies';
import { CANDIDATES, EMPLOYER_JOBS, TEAM } from '@/data/employer';
import { THREADS } from '@/data/messages';
import { NOTIFICATIONS } from '@/data/notifications';
import { CONTACT_COUNT, CONTACT_IDS, CONTACT_REQUESTS } from '@/data/people';
import { PERSONAS, PRO_PROFILE } from '@/data/personas';
import { POSTS } from '@/data/posts';

export const createInitialState = () =>
  structuredClone({
    role: null,
    accounts: [],
    profiles: PERSONAS,
    licenses: PRO_PROFILE.licenses,
    availability: PRO_PROFILE.availability,
    companies: COMPANIES,

    savedJobIds: [2, 8],
    applications: [
      {
        jobId: 5,
        stage: 3,
        appliedOn: 'Nov 9',
        interview: 'Video interview with Aisha Rahman, Thursday, November 12 at 10:00 am',
        threadId: 1,
      },
      { jobId: 4, stage: 1, appliedOn: 'Nov 4' },
      { jobId: 6, stage: 2, appliedOn: 'Oct 28' },
    ],
    jobAlert: false,

    posts: POSTS,
    likedPostIds: [],
    followingCompanyIds: ['prairie-sun-epc', 'lakeshore-training'],
    joinedGroupIds: ['chicago-installers', 'women-in-solar'],
    attendingEventIds: [],
    enrolledCourseIds: [],
    requestedMemberIds: [],
    dismissedMemberIds: [],
    contactRequests: CONTACT_REQUESTS,
    contactIds: CONTACT_IDS,
    contactCount: CONTACT_COUNT,

    threads: THREADS,
    notifications: NOTIFICATIONS,

    employer: {
      verified: true,
      jobs: EMPLOYER_JOBS,
      candidates: CANDIDATES,
      invitesLeft: 18,
      invitedMemberIds: [],
      team: TEAM,
    },

    settings: {
      language: 'English',
      timeZone: 'Central Time',
      profileVisibility: 'Everyone signed in',
      messagesFrom: { pro: 'Contacts and employers I applied to', emp: 'Applicants and contacts' },
      requestsFrom: 'Everyone',
      twoStep: false,
      publicProfile: false,
      appearInSearch: true,
      employerInvites: true,
      weeklySummary: false,
      notify: {},
    },
  });
