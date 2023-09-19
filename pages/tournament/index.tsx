import { gql, useQuery } from '@apollo/client';
import { Box, Card, Grid, Typography } from '@mui/material';

import {
  getCharacterColorName,
  getCharacterName,
} from '../../helpers/characterUtils';
import { getUniqueEntrants } from '../../helpers/utils';

const myTournamentsQuery = gql`
  query myTournaments {
    myTournaments {
      id
      name
      slug
      events {
        sets {
          entrants {
            id
            name
          }
        }
      }
    }
  }
`;

const getPlayerDescription = player => {
  return `${getCharacterName(player.characterId)} (${getCharacterColorName(
    player.characterId,
    player.characterColor
  )})${player.nametag && ` - ${player.nametag}`}`;
};

const Tournament = () => {
  const { data: myTournamentsData } = useQuery(myTournamentsQuery);

  return (
    <Box>
      <div>
        <Typography variant="h3">My Tournaments:</Typography>
        <Grid container spacing={2} padding={6}>
          {myTournamentsData?.myTournaments.length === 0 && (
            <Typography variant="h5">No tournaments found.</Typography>
          )}
          {myTournamentsData?.myTournaments.map(tournament => (
            <Card
              variant="outlined"
              component="a"
              href={`/tournament/${tournament.id}`}
            >
              <Typography variant="h5">{tournament.name}</Typography>
              <Typography variant="body1">
                Number of entrants:{' '}
                {getUniqueEntrants(tournament.events[0].sets).length}
              </Typography>
              <Typography variant="body1">
                Number of sets: {tournament.events[0].sets.length}
              </Typography>
            </Card>
          ))}
        </Grid>
      </div>
      {/* <div>
        <h1>Upload Slippi Files</h1>
        <FileUpload setGames={setGames} />
        <p>Number of files uploaded: {games.length}</p>
        {games.length > 0 && (
          <ul>
            {games.map(game =>
              game.getMetadata().playedOn === 'nintendont' ? (
                <li>
                  {game
                    .getSettings()
                    .players.map(getPlayerDescription)
                    .join(' vs ')}
                </li>
              ) : (
                <li>
                  {game.getMetadata().players[0].names.netplay} vs{' '}
                  {game.getMetadata().players[1].names.netplay}
                </li>
              )
            )}
          </ul>
        )}
      </div> */}
    </Box>
  );
};

export default Tournament;
