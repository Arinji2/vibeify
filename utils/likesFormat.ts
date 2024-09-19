//10000 -> 10k
//1000 -> 1k
//100 -> 100
export const likesFormat = (likes: number) => {
  if (likes >= 10000) return `${(likes / 1000).toFixed(0)}k`;
  if (likes >= 1000) return `${(likes / 100).toFixed(0)}k`;
  return likes;
};
