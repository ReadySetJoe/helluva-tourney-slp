import { PrismaClient, User } from '@prisma/client';

import { fetchGgTournament } from './start-gg';

export const tournament = async (
  _parent,
  { id }: { id: number },
  { models }: { models: PrismaClient }
) => {
  return models.tournament.findUnique({
    where: { id },
    include: {
      events: {
        include: {
          sets: {
            include: {
              entrants: true,
            },
          },
        },
      },
    },
  });
};

export const myTournaments = async (_parent, _args, { models, user }) => {
  return models.tournament.findMany({
    where: { userId: user.id },
    include: {
      events: {
        include: {
          sets: {
            include: {
              entrants: true,
            },
          },
        },
      },
    },
  });
};

export const tournaments = async (_parent, _args, { models }) => {
  return models.tournament.findAll({});
};

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

  await Promise.all(
    eventData.sets.nodes.map(async ggSet => {
      const set = await models.set.create({
        data: {
          ggId: ggSet.id,
          round: ggSet.fullRoundText,
          eventId: event.id,
          entrants: {
            create: ggSet.slots.map(slot => ({
              ggId: slot.entrant.id,
              name: slot.entrant.name,
            })),
          },
        },
      });

      // await Promise.all(
      //   ggSet.slots.map(slot => {
      //     return models.entrant.create({
      //       data: {
      //         setId: set.id,
      //         name: slot.entrant.name,
      //         ggId: slot.entrant.id,
      //       },
      //     });
      //   })
      // );
    })
  );

  return {
    id: tournament.id,
    name: tournament.name,
  };
};

export const deleteTournament = async (
  _parent,
  { id }: { id: number },
  { models }: { models: PrismaClient }
) => {
  await models.tournament.delete({ where: { id } });
  return true;
};
