import { PrismaClient, User } from '@prisma/client';

import { fetchGgTournament } from './start-gg';

export const createTournament = async (
  parent: any,
  { slug }: { slug: string },
  { user, models }: { user: User; models: PrismaClient }
) => {
  const existingTournament = await models.tournament.findFirst({
    where: { slug },
  });

  if (existingTournament) {
    return existingTournament;
  }

  const { tournament: tournamentData, event: eventData } =
    await fetchGgTournament(parent, { slug });

  const tournament = await models.tournament.create({
    data: {
      name: tournamentData.name,
      slug,
      userId: user.id,
    },
  });

  const event = await models.event.create({
    data: {
      ggId: eventData.id,
      tournamentId: tournament.id,
    },
  });

  const sets = await Promise.all(
    eventData.sets.nodes.map(set => {
      return models.set.create({
        data: {
          ggId: set.id,
          round: set.fullRoundText,
          eventId: event.id,
        },
      });
    })
  );

  await Promise.all(
    eventData.sets.nodes.map(set => {
      return Promise.all(
        set.slots.map(slot => {
          return models.entrant.create({
            data: {
              name: slot.entrant.name,
              ggId: slot.entrant.id,
            },
          });
        })
      );
    })
  );

  return {
    id: tournament.id,
    name: tournamentData.name,
    event: {
      id: eventData.id,
      sets: eventData.sets.nodes.map(set => ({
        id: set.id,
        round: set.fullRoundText,
        entrants: set.slots.map(slot => slot.entrant),
      })),
    },
  };
};

export const myTournaments = async (_parent, _args, { models, user }) => {
  return models.tournament.findMany({
    where: { userId: user.id },
  });
};

export const tournaments = async (_parent, _args, { models }) => {
  return models.tournament.findAll({});
};
