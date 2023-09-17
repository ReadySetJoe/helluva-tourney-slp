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
      fullRoundText: string;
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
