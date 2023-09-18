import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Query {
    tournament(id: Int!): Tournament
    tournaments: [Tournament]
    myTournaments: [Tournament]
    fetchGgTournament(slug: String!): GgTournamentQueryResponse
  }

  type Mutation {
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
    round: String
    entrants: [Entrant]
  }

  type Entrant {
    id: Int!
    name: String!
  }
`;

export default typeDefs;
