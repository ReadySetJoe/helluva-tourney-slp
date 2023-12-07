import { PrismaClient } from '@prisma/client';
import { GameStartType, MetadataType } from '@slippi/slippi-js';

import {
  getCharacterColorName,
  getCharacterName,
} from '../../helpers/characterUtils';

export const slpGame = async (
  _parent: any,
  { tournamentId, fileName }: { tournamentId: number; fileName: string },
  { models }: { models: PrismaClient }
) => {
  return models.slpGame.findFirst({
    where: { tournamentId, fileName },
    include: {
      slpPlayers: true,
    },
  });
};

export const slpGames = async (
  _parent: any,
  { tournamentId }: { tournamentId: number },
  { models }: { models: PrismaClient }
) => {
  return models.slpGame.findMany({
    where: { tournamentId },
    include: {
      slpPlayers: true,
    },
  });
};

export const getSlpPlayer = (
  player: GameStartType['players'][0],
  metadata: MetadataType,
  defaultName: string
) => {
  const name =
    player.nametag ??
    metadata.players[player.playerIndex].names.netplay ??
    metadata.players[player.playerIndex].names.code ??
    defaultName;

  return {
    playerIndex: player.playerIndex,
    name,
    characterName: getCharacterName(player.characterId),
    characterColorName: getCharacterColorName(
      player.characterId,
      player.characterColor
    ),
    isWinner: null,
  };
};

export const createSlpGame = async (
  _parent: any,
  { input },
  { user, models }: { user: any; models: PrismaClient }
) => {
  const { fileName, url, tournamentId, startAt, stage, slpPlayers } = input;

  const existingGame = await models.slpGame.findFirst({
    where: { fileName, url, tournamentId },
  });

  if (existingGame) {
    return existingGame;
  }

  return models.slpGame.create({
    data: {
      fileName,
      url,
      stage,
      startAt,
      slpPlayers: {
        create: slpPlayers,
      },
      user: {
        connect: {
          id: user.id,
        },
      },
      tournament: {
        connect: {
          id: tournamentId,
        },
      },
    },
  });
};
