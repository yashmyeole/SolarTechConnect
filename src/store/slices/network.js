import { toggleItem } from '@/lib/toggleItem';

const toggling = (key) => (set, get) => (id) => {
  set((state) => ({ [key]: toggleItem(state[key], id) }));
  return get()[key].includes(id);
};

export const networkSlice = (set, get) => ({
  toggleLike: toggling('likedPostIds')(set, get),
  toggleFollow: toggling('followingCompanyIds')(set, get),
  toggleGroup: toggling('joinedGroupIds')(set, get),
  toggleEvent: toggling('attendingEventIds')(set, get),
  toggleCourse: toggling('enrolledCourseIds')(set, get),
  toggleContactRequest: toggling('requestedMemberIds')(set, get),

  addPost: (post) => set((state) => ({ posts: [{ id: Date.now(), likes: 0, replies: [], ...post }, ...state.posts] })),

  addReply: (postId, reply) =>
    set((state) => ({
      posts: state.posts.map((post) => (post.id === postId ? { ...post, replies: [...post.replies, reply] } : post)),
    })),

  dismissSuggestion: (memberId) => set((state) => ({ dismissedMemberIds: [...state.dismissedMemberIds, memberId] })),

  answerContactRequest: (memberId, accept) =>
    set((state) => ({
      contactRequests: state.contactRequests.filter((request) => request.memberId !== memberId),
      contactIds: accept ? [memberId, ...state.contactIds] : state.contactIds,
      contactCount: accept ? state.contactCount + 1 : state.contactCount,
    })),
});
