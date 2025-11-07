export const useDates = () => {
  const getCurrentYear = () => new Date().getFullYear();
  return { getCurrentYear };
};
