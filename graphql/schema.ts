import { gql } from 'graphql-tag';

const typeDefs = gql`
  type Query {
    getTournament(slug: String!): Tournament
  }

  type Tournament {
    id: ID!
    name: String!
    event: Event
  }

  type Event {
    id: ID!
    name: String!
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
