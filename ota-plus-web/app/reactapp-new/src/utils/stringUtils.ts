export const makeAcronym = (text: string): string => (
  text.split(/\s/).reduce((acc, word) => acc + word.charAt(0).toUpperCase(), '')
);
