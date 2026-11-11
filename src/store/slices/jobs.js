import { todayShort } from '@/lib/format';
import { toggleItem } from '@/lib/toggleItem';

export const jobsSlice = (set, get) => ({
  toggleSavedJob: (jobId) => {
    set((state) => ({ savedJobIds: toggleItem(state.savedJobIds, jobId) }));
    return get().savedJobIds.includes(jobId);
  },

  applyToJob: (jobId) =>
    set((state) => ({ applications: [{ jobId, stage: 0, appliedOn: todayShort() }, ...state.applications] })),

  setJobAlert: (on) => set({ jobAlert: on }),
});
