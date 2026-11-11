export const DEMO_MODE = import.meta.env.VITE_DEMO_MODE !== 'false';

export const SEARCH_SHORTCUT = /Mac|iPhone|iPad/.test(navigator.platform) ? '⌘ K' : 'Ctrl K';
