export const safeNext = (next) => (next && next.startsWith('/') && !next.startsWith('//') ? next : null);
