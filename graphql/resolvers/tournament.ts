import { formatISO } from 'date-fns';

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
      events: {
        create: [
          {
            ggId: eventData.id,
            sets: {
              create: eventData.sets.nodes.map(ggSet => ({
                ggId: ggSet.id,
                round: ggSet.round,
                roundText: ggSet.fullRoundText,
                displayScore: ggSet.displayScore,
                completedAt: formatISO(ggSet.completedAt * 1000),
                winnerGgId: ggSet.winnerId,
                entrants: {
                  create: ggSet.slots.map(slot => ({
                    ggId: slot.entrant.id,
                    name: slot.entrant.name,
                  })),
                },
              })),
            },
          },
        ],
      },
    },
  });

  return {
    ...tournament,
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
