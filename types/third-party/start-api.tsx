export type TournamentQueryVariables = {
  slug: string;
};

export type TournamentQueryResponse = {
  id: number;
  name: string;
  events: {
    id: number;
    videogame: {
      id: number;
    };
    type: number;
  }[];
};

export type EventSetsQueryVariables = {
  eventId: number;
  page: number;
  perPage: number;
};

export type EventSetsQueryResponse = {
  id: number;
  name: string;
  sets: {
    pageInfo: {
      total: number;
    };
    nodes: {
      id: number;
      round: number;
      fullRoundText: string;
      winnerId: number;
      slots: {
        id: string;
        entrant: {
          id: number;
          name: string;
        };
      }[];
    }[];
  };
};
