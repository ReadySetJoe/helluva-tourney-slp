export const top8 = [
  'Grand Final Reset',
  'Grand Final',
  'Winners Final',
  'Losers Final',
  'Winners Semi-Final',
  'Losers Semi-Final',
  'Winners Quarter-Final',
  'Losers Quarter-Final',
];

export const getUniqueEntrants = (sets: any) => {
  const entrants = new Set();
  for (const set of sets) {
    for (const entrant of set.entrants) {
      entrants.add(entrant.name);
    }
  }
  return Array.from(entrants);
};

const createKeyedHashMap = (sets: any, key: string) => {
  const roundHashMap = new Map();
  for (const set of sets) {
    const round = set[key];
    if (!roundHashMap.has(round)) {
      roundHashMap.set(round, []);
    }
    roundHashMap.get(round).push(set);
  }
  return roundHashMap;
};

const convertToRoundHashMap = (roundTextHashMap: any) => {
  const roundHashMap = new Map();
  for (const [_roundText, sets] of roundTextHashMap) {
    const round = sets[0].round;
    if (!roundHashMap.has(round)) {
      roundHashMap.set(round, []);
    }
    roundHashMap.get(round).push(...sets);
  }
  return roundHashMap;
};

export const sortByRound = (sets: any) => {
  const roundTextHashMap = createKeyedHashMap(sets, 'roundText');
  const newRounds = [];
  const roundsText = Array.from(roundTextHashMap.keys());

  for (const top8Round of top8) {
    const newRound = roundTextHashMap.get(top8Round);
    if (newRound) {
      newRounds.push(newRound);
      roundTextHashMap.delete(top8Round);
      const roundIdx = roundsText.indexOf(top8Round);
      roundsText.splice(roundIdx, 1);
    }
  }

  const roundHashMap = convertToRoundHashMap(roundTextHashMap);
  const rounds = Array.from(roundHashMap.keys());

  const sortedRounds = rounds.sort((a, b) => b - a);
  let isMaxRound = true;

  while (sortedRounds.length > 0) {
    if (isMaxRound) {
      newRounds.push(roundHashMap.get(sortedRounds.shift()));
    } else {
      newRounds.push(roundHashMap.get(sortedRounds.pop()));
    }
    isMaxRound = !isMaxRound;
  }

  const newSets = [];
  for (const round of newRounds) {
    newSets.push(...round);
  }
  return newSets;
};

export const sortByTime = (sets: any, order: string) => {
  return [...sets].sort((a: any, b: any) => {
    if (order === 'asc') {
      return a.completedAt > b.completedAt ? 1 : -1;
    }
    return a.completedAt < b.completedAt ? 1 : -1;
  });
};

export const filterByEntrant = (sets: any, entrant: string) => {
  return sets.filter(set => {
    return set.entrants.find(e => e.name === entrant);
  });
};
