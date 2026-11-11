import { create } from 'zustand';

export const useUiStore = create((set) => ({
  toast: null,
  searchOpen: false,
  showToast: (message) => set({ toast: { id: Date.now(), message } }),
  hideToast: () => set({ toast: null }),
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
}));

export const toast = (message) => useUiStore.getState().showToast(message);
