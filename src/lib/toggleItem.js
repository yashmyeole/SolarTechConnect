export const toggleItem = (list, item) =>
  list.includes(item) ? list.filter((entry) => entry !== item) : [...list, item];
