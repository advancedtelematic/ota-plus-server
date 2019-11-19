/* eslint-disable import/prefer-default-export */
export const makeAcronym = text => (
  text.split(/\s/).reduce((acc, word) => acc + word.charAt(0).toUpperCase(), '')
);
