import { fetchGgTournament } from './start-gg';
import { createTournament, myTournaments, tournaments } from './tournament';

const resolvers = {
  Query: {
    fetchGgTournament,
    myTournaments,
    tournaments,
  },
  Mutation: {
    createTournament,
  },
};

export default resolvers;
