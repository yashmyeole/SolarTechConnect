import { timeNow } from '@/lib/format';

const updateThreads = (state, role, threadId, update) => ({
  threads: {
    ...state.threads,
    [role]: state.threads[role].map((thread) => (thread.id === threadId ? update(thread) : thread)),
  },
});

export const messagingSlice = (set, get) => ({
  markThreadRead: (role, threadId) =>
    set((state) => updateThreads(state, role, threadId, (thread) => ({ ...thread, unread: false }))),

  sendMessage: (role, threadId, text) => {
    const time = timeNow();
    set((state) =>
      updateThreads(state, role, threadId, (thread) => ({
        ...thread,
        time,
        messages: [...thread.messages, { from: 'me', text, day: 'Today', time }],
      })),
    );
  },

  findOrStartThread: (role, contact, subtitle) => {
    const existing = get().threads[role].find(
      (thread) => thread.with.kind === contact.kind && thread.with.id === contact.id,
    );
    if (existing) return existing.id;
    const id = Math.max(0, ...get().threads[role].map((thread) => thread.id)) + 1;
    const thread = {
      id,
      with: contact,
      subtitle,
      unread: false,
      time: 'Now',
      topic: role === 'emp' ? 'jobs' : 'all',
      messages: [],
    };
    set((state) => ({ threads: { ...state.threads, [role]: [thread, ...state.threads[role]] } }));
    return id;
  },

  markNotificationRead: (role, id) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [role]: state.notifications[role].map((item) => (item.id === id ? { ...item, unread: false } : item)),
      },
    })),

  markAllNotificationsRead: (role) =>
    set((state) => ({
      notifications: {
        ...state.notifications,
        [role]: state.notifications[role].map((item) => ({ ...item, unread: false })),
      },
    })),
});
