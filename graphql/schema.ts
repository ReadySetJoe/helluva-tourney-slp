import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Query {
    fetchGgTournament(slug: String!): GgTournamentQueryResponse
    myTournaments: [Tournament]
    tournament(id: Int!): Tournament
    tournaments: [Tournament]
    slpGames(tournamentId: Int!): [SlpGame]
  }

  type Mutation {
    createSlpGame(input: SlpGameInput!): SlpGame
    createTournament(slug: String!): Tournament
    deleteTournament(id: Int!): Boolean
  }

  type GgTournamentQueryResponse {
    tournament: GgTournament
    event: GgEvent
  }

  type GgTournament {
    slug: String!
    name: String!
  }

  type GgEvent {
    id: Int!
    name: String!
    sets: GgSetConnection
  }

  type GgSetConnection {
    nodes: [GgSet]
  }

  type GgSet {
    id: Int!
    fullRoundText: String!
    completedAt: String!
    slots: [GgSlot]
  }

  type GgSlot {
    id: Int!
    entrant: GgEntrant
  }

  type GgEntrant {
    id: Int!
    name: String!
  }

  type Tournament {
    id: Int!
    slug: String!
    name: String!
    events: [Event]
  }

  type Event {
    id: Int!
    finalRound: Int
    sets: [Set]
  }

  type Set {
    id: Int!
    round: Int
    roundText: String
    entrants: [Entrant]
    completedAt: String
    winnerGgId: Int
  }

  type Entrant {
    id: Int!
    ggId: Int!
    name: String!
  }

  type SlpGame {
    id: Int!
    fileName: String!
    url: String!
    stage: String!
    startAt: String!
    tournament: Tournament
    set: Set
    slpPlayers: [SlpPlayer]
  }

  type SlpPlayer {
    id: Int!
    name: String!
    characterName: String!
    characterColorName: String!
  }

  input SlpGameInput {
    fileName: String!
    url: String!
    tournamentId: Int!
    stage: String!
    startAt: String!
    slpPlayers: [SlpPlayerInput!]!
  }

  input SlpPlayerInput {
    name: String!
    characterName: String!
    characterColorName: String!
  }
`;

export default typeDefs;
