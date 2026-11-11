import { COMPANIES, OWN_COMPANY_ID } from '@/data/companies';
import { PERSONAS } from '@/data/personas';
import { createInitialState } from '../initialState';

const COMPANY_FIELDS = ['name', 'site', 'size', 'city'];

const DEMO_ACCOUNTS = Object.entries(PERSONAS).map(([role, identity]) => ({
  role,
  email: identity.email,
  identity,
  demo: true,
}));

const sameEmail = (a, b) => a.trim().toLowerCase() === b.trim().toLowerCase();

const pickCompany = (company) => Object.fromEntries(COMPANY_FIELDS.map((key) => [key, company[key]]));

function applyAccount(state, account) {
  const next = { role: account.role, profiles: { ...state.profiles, [account.role]: account.identity } };
  if (account.role === 'emp') {
    const fields = account.company ?? pickCompany(COMPANIES[OWN_COMPANY_ID]);
    next.companies = { ...state.companies, [OWN_COMPANY_ID]: { ...state.companies[OWN_COMPANY_ID], ...fields } };
    next.employer = { ...state.employer, verified: account.verified ?? true };
  }
  return next;
}

export const accountSlice = (set, get) => ({
  findAccount: (email) => [...DEMO_ACCOUNTS, ...get().accounts].find((account) => sameEmail(account.email, email)),

  signIn: (email) => {
    const account = get().findAccount(email);
    if (account) set((state) => applyAccount(state, account));
    return account?.role ?? null;
  },

  signInDemo: (role) => get().signIn(PERSONAS[role].email),

  signOut: () => set({ role: null }),

  createAccount: (role, details) => {
    const name = `${details.firstName} ${details.lastName}`.trim();
    const persona = PERSONAS[role];
    const account = {
      role,
      email: details.email,
      identity: { ...persona, name, email: details.email, phone: details.phone },
    };
    if (role === 'pro') {
      Object.assign(account.identity, {
        city: details.city,
        trade: details.trade,
        headline: `${details.trade} · ${details.city}`,
      });
    } else {
      account.identity.headline = `Hiring at ${details.companyName}`;
      account.company = {
        name: details.companyName,
        site: details.website.replace(/^https?:\/\//, '').replace(/\/$/, ''),
        size: details.size,
        city: `${details.city}, ${details.state}`,
      };
      account.verified = details.verified;
    }
    set((state) => ({
      accounts: [...state.accounts.filter((item) => !sameEmail(item.email, account.email)), account],
      ...applyAccount(state, account),
    }));
    if (role === 'pro') {
      get().setAvailability({ ...get().availability, open: details.available });
      details.certifications.forEach((certification) => get().addLicense({ certification, name: certification }));
    }
  },

  updateProfile: (role, fields) =>
    set((state) => ({ profiles: { ...state.profiles, [role]: { ...state.profiles[role], ...fields } } })),

  updateCompany: (id, fields) =>
    set((state) => ({ companies: { ...state.companies, [id]: { ...state.companies[id], ...fields } } })),

  addLicense: (license) =>
    set((state) =>
      state.licenses.some((item) => item.certification === license.certification)
        ? state
        : { licenses: [...state.licenses, { issuer: '', date: '', ...license }] },
    ),

  setAvailability: (availability) => set({ availability }),

  setSetting: (key, value) => set((state) => ({ settings: { ...state.settings, [key]: value } })),

  setNotifyPreference: (key, value) =>
    set((state) => ({ settings: { ...state.settings, notify: { ...state.settings.notify, [key]: value } } })),

  resetDemo: () => set({ ...createInitialState(), role: get().role }),
});
