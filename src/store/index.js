import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createInitialState } from './initialState';
import { accountSlice } from './slices/account';
import { employerSlice } from './slices/employer';
import { jobsSlice } from './slices/jobs';
import { messagingSlice } from './slices/messaging';
import { networkSlice } from './slices/network';

export const useAppStore = create()(
  persist(
    (set, get) => ({
      ...createInitialState(),
      ...accountSlice(set, get),
      ...jobsSlice(set, get),
      ...networkSlice(set, get),
      ...messagingSlice(set, get),
      ...employerSlice(set, get),
    }),
    { name: 'solar-tech-connect-demo', version: 1, storage: createJSONStorage(() => localStorage) },
  ),
);

export const useRole = () => useAppStore((state) => state.role);

export const usePersona = () => useAppStore((state) => state.profiles[state.role ?? 'pro']);

export const useCompanies = () => useAppStore((state) => state.companies);

export const homePath = (role) => ({ pro: '/home', emp: '/employer' })[role] ?? '/';
