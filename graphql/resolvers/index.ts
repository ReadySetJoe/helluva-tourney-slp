import { createSlpGame, slpGame, slpGames } from './slp-game';
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
    slpGame,
    slpGames,
    tournaments,
    tournament,
  },
  Mutation: {
    createTournament,
    createSlpGame,
    deleteTournament,
  },
};

export default resolvers;
