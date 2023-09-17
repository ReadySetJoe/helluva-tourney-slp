import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Query {
    tournaments: [Tournament]
    myTournaments: [Tournament]
    fetchGgTournament(slug: String!): GgTournamentQueryResponse
  }

  type Mutation {
    createTournament(slug: String!): Tournament
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
    id: ID!
    name: String!
    sets: GgSetConnection
  }

  type GgSetConnection {
    nodes: [GgSet]
  }

  type GgSet {
    id: ID!
    fullRoundText: String!
    slots: [GgSlot]
  }

  type GgSlot {
    id: ID!
    entrant: GgEntrant
  }

  type GgEntrant {
    id: ID!
    name: String!
  }

  type Tournament {
    id: ID!
    slug: String!
    name: String!
    event: Event
  }

  type Event {
    id: ID!
    finalRound: Int
    sets: [Set]
  }

  type Set {
    id: ID!
    round: String
    entrants: [Entrant]
  }

  type Entrant {
    id: ID!
    name: String!
  }
`;

export default typeDefs;
