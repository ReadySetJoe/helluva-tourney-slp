import {
  EventSetsQueryResponse,
  TournamentQueryResponse,
} from '../../types/third-party/start-api';

export const getTournament = async (parent, { slug }, third) => {
  const tournamentBody = JSON.stringify({
    query: `
      query TournamentPageHead($slug: String!) {
        tournament(slug: $slug) {
          id
          name
          events {
            id
            videogame {
              id
            }
          }
        }
      }
  `,
    variables: { slug },
  });

  const headers = {
    Authorization: `Bearer ${process.env.START_GG_API_KEY}`,
    'Content-Type': 'application/json',
  };

  const tournamentRes = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers,
    body: tournamentBody,
  });

  const tournamentData = (await tournamentRes.json()).data
    .tournament as TournamentQueryResponse;

  const eventId = tournamentData.events.find(e => e.videogame.id === 1).id;

  const eventBody = JSON.stringify({
    query: `query EventSets($eventId: ID!, $page: Int!, $perPage: Int!) {
          event(id: $eventId) {
            id
            name
            sets(
              page: $page
              perPage: $perPage
              sortType: STANDARD
            ) {
              nodes {
                id
                fullRoundText
                slots {
                  id
                  entrant {
                    id
                    name
                  }  
                }
              }
            }
          }
        }`,
    variables: { eventId, page: 1, perPage: 100 },
  });

  const eventRes = await fetch('https://api.start.gg/gql/alpha', {
    method: 'POST',
    headers,
    body: eventBody,
  });

  const eventData = (await eventRes.json()).data
    .event as EventSetsQueryResponse;

  const event = {
    id: eventData.id,
    name: eventData.name,
    sets: eventData.sets.nodes.map(set => ({
      id: set.id,
      round: set.fullRoundText,
      entrants: set.slots.map(slot => slot.entrant),
    })),
  };

  return {
    id: tournamentData.id,
    name: tournamentData.name,
    event,
  };
};