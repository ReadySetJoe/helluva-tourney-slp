import { fetchGgTournament } from './start-gg';
import {
  createTournament,
  deleteTournament,
  myTournaments,
  tournament,
  tournaments,
} from './tournament';

const resolvers = {
  Query: {
    fetchGgTournament,
    myTournaments,
    tournaments,
    tournament,
  },
  Mutation: {
    createTournament,
    deleteTournament,
  },
};

export default resolvers;
