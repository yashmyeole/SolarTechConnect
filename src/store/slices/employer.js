import { todayShort } from '@/lib/format';

const updateEmployer = (state, fields) => ({ employer: { ...state.employer, ...fields } });

const updateCandidate = (state, memberId, update) =>
  updateEmployer(state, {
    candidates: state.employer.candidates.map((candidate) =>
      candidate.memberId === memberId ? update(candidate) : candidate,
    ),
  });

export const employerSlice = (set, get) => ({
  setEmployerVerified: (verified) => set((state) => updateEmployer(state, { verified })),

  publishJob: (draft) =>
    set((state) =>
      updateEmployer(state, {
        jobs: [
          {
            id: Date.now(),
            title: draft.title,
            location: draft.location,
            status: 'open',
            applicants: 0,
            newApplicants: 0,
            views: 0,
            date: todayShort(),
            pipeline: [0, 0, 0, 0],
          },
          ...state.employer.jobs,
        ],
      }),
    ),

  advanceCandidate: (memberId) => {
    set((state) => updateCandidate(state, memberId, (candidate) => ({ ...candidate, stage: candidate.stage + 1 })));
    return get().employer.candidates.find((candidate) => candidate.memberId === memberId)?.stage;
  },

  rejectCandidate: (memberId) =>
    set((state) =>
      updateEmployer(state, {
        candidates: state.employer.candidates.filter((candidate) => candidate.memberId !== memberId),
      }),
    ),

  addCandidateNote: (memberId, note) =>
    set((state) =>
      updateCandidate(state, memberId, (candidate) => ({ ...candidate, notes: [note, ...candidate.notes] })),
    ),

  inviteTeammate: (email, role) =>
    set((state) =>
      updateEmployer(state, { team: [...state.employer.team, { name: email, role, lastActive: 'Invited' }] }),
    ),

  inviteToApply: (memberId) =>
    set((state) =>
      updateEmployer(state, {
        invitedMemberIds: [...state.employer.invitedMemberIds, memberId],
        invitesLeft: state.employer.invitesLeft - 1,
      }),
    ),
});
