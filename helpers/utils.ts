import { uniqBy } from 'lodash';

export const getUniqueEntrants = (sets: any) => {
  const entrants = new Set();
  for (const set of sets) {
    for (const entrant of set.entrants) {
      entrants.add(entrant.name);
    }
  }
  return Array.from(entrants);
};
