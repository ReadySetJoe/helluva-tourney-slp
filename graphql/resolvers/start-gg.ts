import {
  EventSetsQueryResponse,
  TournamentQueryResponse,
} from '../../types/third-party/start-api';

export const fetchGgTournament = async (
  _parent: any,
  { slug }: { slug: string }
) => {
  const tournamentBody = JSON.stringify({
    query: `
      query TournamentPageHead($slug: String!) {
        tournament(slug: $slug) {
          id
          name
          events {
            id
            type
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

  const tournament = (await tournamentRes.json()).data
    .tournament as TournamentQueryResponse;

  const eventId = tournament.events.find(
    e => e.videogame.id === 1 && e.type === 1
  ).id;

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
                round
                fullRoundText
                winnerId
                displayScore
                completedAt
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

  const event = (await eventRes.json()).data.event as EventSetsQueryResponse;

  return { tournament, event };
};
