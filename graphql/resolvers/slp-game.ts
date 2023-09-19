import { PrismaClient } from '@prisma/client';
import { SlippiGame } from '@slippi/slippi-js';

import {
  getCharacterColorName,
  getCharacterName,
} from '../../helpers/characterUtils';
import { getStageName } from '../../helpers/stageUtils';

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
  player: any,
  metadata: any,
  defaultName: string
) => {
  const netplayName = metadata.names?.netplay;
  const netplayCode = metadata.names?.code;

  return {
    name: player.nametag || netplayName || netplayCode || defaultName,
    characterName: getCharacterName(player.characterId),
    characterColorName: getCharacterColorName(
      player.characterId,
      player.characterColor
    ),
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

  // console.log('made it here 1');
  // const gameData = await fetch(url as string);
  // console.log('made it here 2');
  // const game = new SlippiGame(await gameData.arrayBuffer());
  // console.log('made it here 3');
  // const settings = game.getSettings();
  // const metadata = game.getMetadata();

  // console.log('settings', settings.enabledItems);

  // const p1 = settings.players[0];
  // const p2 = settings.players[1];

  // const slpPlayer1 = getSlpPlayer(p1, metadata.players[p1.playerIndex]);
  // const slpPlayer2 = getSlpPlayer(p2, metadata.players[p2.playerIndex]);

  // const stage = getStageName(settings.stageId);

  // console.log('made it here 3.5');
  const slpGame = await models.slpGame.create({
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

  console.log('made it here 4', slpGame);

  return slpGame;
};
