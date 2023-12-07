import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { gql, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { CloudUpload } from '@mui/icons-material';
import CheckIcon from '@mui/icons-material/Check';
import {
  Box,
  Button,
  Card,
  Grid,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { SlippiGame } from '@slippi/slippi-js';

import { getSlpPlayer } from '../../graphql/resolvers/slp-game';
import { getAllCharacters } from '../../helpers/characterUtils';
import { getStageName } from '../../helpers/stageUtils';
import {
  filterByEntrant,
  getUniqueEntrants,
  sortByRound,
  sortByTime,
  sortSlpGamesByTime,
  top8,
} from '../../helpers/utils';

const tournamentQuery = gql`
  query tournament($id: Int!) {
    tournament(id: $id) {
      id
      name
      slug
      events {
        id
        sets {
          id
          round
          roundText
          completedAt
          winnerGgId
          displayScore
          entrants {
            id
            ggId
            name
          }
        }
      }
    }
  }
`;

const deleteTournamentQuery = gql`
  mutation deleteTournament($id: Int!) {
    deleteTournament(id: $id)
  }
`;

const createSlpGameQuery = gql`
  mutation createSlpGame($input: SlpGameInput!) {
    createSlpGame(input: $input) {
      id
    }
  }
`;

const slpGamesQuery = gql`
  query slpGames($tournamentId: Int!) {
    slpGames(tournamentId: $tournamentId) {
      id
      fileName
      url
      stage
      startAt
      slpPlayers {
        id
        name
        characterName
        characterColorName
        isWinner
      }
    }
  }
`;

const slpGameQuery = gql`
  query slpGame($tournamentId: Int!, $fileName: String!) {
    slpGame(tournamentId: $tournamentId, fileName: $fileName) {
      id
    }
  }
`;

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const Tournament = () => {
  const [setsPage, setSetsPage] = useState(0);
  const [sets, setSets] = useState([]);
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    'all' as string
  );
  const [selectedFilterSubOption, setSelectedFilterSubOption] = useState(
    '' as string
  );
  const [selectedSortOption, setSelectedSortOption] = useState('round');
  const [selectedSortSubOption, setSelectedSortSubOption] = useState('desc');
  const [games, setGames] = useState([]);
  const [selectedSlpFilterOption, setSelectedSlpFilterOption] = useState(
    'all' as string
  );
  const [selectedSlpFilterSubOption, setSelectedSlpFilterSubOption] = useState(
    '' as string
  );
  const [selectedSlpSortOption, setSelectedSlpSortOption] = useState('time');
  const [selectedSlpSortSubOption, setSelectedSlpSortSubOption] =
    useState('desc');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadProgressTotal, setUploadProgressTotal] = useState(0);

  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  const { data: tournamentData } = useQuery(tournamentQuery, {
    variables: { id },
  });
  const tournament = tournamentData?.tournament;
  const uniqueEntrants = getUniqueEntrants(tournament?.events[0].sets || []);

  const [getSlpGameQuery] = useLazyQuery(slpGameQuery);

  const { data: slpGamesData, refetch: refetchSlpGames } = useQuery(
    slpGamesQuery,
    {
      variables: { tournamentId: id },
    }
  );
  const slpGames = slpGamesData?.slpGames;

  useEffect(() => {
    if (!tournament?.events[0]?.sets) return;
    const sets = tournament.events[0].sets;
    let filteredSets;
    if (selectedFilterOption === 'all') {
      filteredSets = sets;
    } else if (selectedFilterOption === 'top8') {
      filteredSets = sets.filter(set => top8.includes(set.roundText));
    } else if (selectedFilterOption === 'entrant') {
      filteredSets = filterByEntrant(sets, selectedFilterSubOption);
    }

    let sorted;
    if (selectedSortOption === 'round') {
      sorted = sortByRound(filteredSets);
    } else if (selectedSortOption === 'time') {
      sorted = sortByTime(filteredSets, selectedSortSubOption);
    }
    setSets(sorted.slice(setsPage * 10, setsPage * 10 + 10));
  }, [
    tournament,
    setsPage,
    selectedFilterOption,
    selectedFilterSubOption,
    selectedSortOption,
    selectedSortSubOption,
  ]);

  useEffect(() => {
    setSetsPage(0);
  }, [
    selectedFilterOption,
    selectedFilterSubOption,
    selectedSortOption,
    selectedSortSubOption,
  ]);

  const [createSlpGame] = useMutation(createSlpGameQuery);

  const uploadFiles = async e => {
    setUploading(true);
    setUploadProgress(0);
    setUploadProgressTotal(e.target.files.length);

    for (const file of e.target.files) {
      const { data } = await getSlpGameQuery({
        variables: { tournamentId: id, fileName: file.name },
      });

      if (data?.slpGame) {
        setUploadProgress(progress => progress + 1);
        continue;
      }

      try {
        const res = await fetch(
          `/api/slp/upload?fileName=${file.name}&fileType=${file.type}&groupName=${tournament.id}`,
          {
            method: 'POST',
          }
        );

        const { preSignedUrl } = await res.json();
        const upload = await fetch(preSignedUrl, {
          method: 'PUT',
          body: file,
          headers: { 'Content-Type': file.type },
        });

        setUploadProgress(progress => progress + 1);

        const setupReader = file => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = ev => {
              const contents = ev.target.result;
              const game = new SlippiGame(contents);
              resolve(game);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
          });
        };

        const game = (await setupReader(file)) as SlippiGame;

        const settings = game.getSettings();
        const metadata = game.getMetadata();
        const [winner] = game.getWinners();

        const p1 = settings.players[0];
        const p2 = settings.players[1];

        const slpPlayer1 = getSlpPlayer(p1, metadata, 'Player 1');
        const slpPlayer2 = getSlpPlayer(p2, metadata, 'Player 2');

        slpPlayer1.isWinner = winner?.playerIndex === p1.playerIndex;
        slpPlayer2.isWinner = winner?.playerIndex === p2.playerIndex;

        const stage = getStageName(settings.stageId);

        await createSlpGame({
          variables: {
            input: {
              fileName: file.name,
              url: upload.url.split('?')[0],
              tournamentId: tournament.id,
              stage,
              startAt: new Date(metadata.startAt),
              slpPlayers: [slpPlayer1, slpPlayer2],
            },
          },
        });
      } catch (error) {
        console.error('Error uploading file:', file.name);
      }
    }
    refetchSlpGames();
    setUploading(false);
  };

  const [deleteTournament] = useMutation(deleteTournamentQuery, {
    variables: { id },
  });

  const handleDeleteTournament = async () => {
    await deleteTournament();
    router.push('/tournament');
  };

  const maxPage = Math.floor(sets.length / 10);
  const remainingSets = sets.length % 10 === 0 ? 1 : 0;
  const pagination = (
    <Box display="flex" sx={{ alignItems: 'center' }}>
      <Button
        onClick={() => setSetsPage(0)}
        disabled={setsPage === 0}
        size="small"
      >
        {'<<'}
      </Button>
      <Button
        onClick={() => setSetsPage(setsPage - 1)}
        disabled={setsPage === 0}
        size="small"
      >
        {'<'}
      </Button>
      <Typography>Page {setsPage + 1}</Typography>
      <Button
        onClick={() => setSetsPage(setsPage + 1)}
        disabled={setsPage === maxPage}
        size="small"
      >
        {'>'}
      </Button>
      <Button
        onClick={() => setSetsPage(maxPage - remainingSets)}
        disabled={setsPage === maxPage - remainingSets}
        size="small"
      >
        {'>>'}
      </Button>
    </Box>
  );

  const isWinner = (set, entrant) => {
    if (set.winnerGgId === entrant.ggId) {
      return '(W)';
    } else {
      return '';
    }
  };

  useEffect(() => {
    if (!slpGames) return;
    let filteredGames;
    if (selectedSlpFilterOption === 'all') {
      filteredGames = slpGames;
    } else if (selectedSlpFilterOption === 'character') {
      filteredGames = slpGames.filter(game => {
        return game.slpPlayers.some(
          player => player.characterName === selectedSlpFilterSubOption
        );
      });
    }

    let sorted;
    if (selectedSlpSortOption === 'time') {
      sorted = sortSlpGamesByTime(filteredGames, selectedSlpSortSubOption);
    }
    setGames(sorted);
  }, [
    slpGames,
    selectedSlpFilterOption,
    selectedSlpFilterSubOption,
    selectedSlpSortOption,
    selectedSlpSortSubOption,
  ]);

  return (
    <Box>
      <Box
        display="flex"
        alignItems="center"
        marginBottom={2}
        width="100%"
        justifyContent="space-between"
      >
        <Typography variant="h4">{tournament?.name}</Typography>
        <Button
          component="label"
          variant="contained"
          startIcon={<CloudUpload />}
          disabled={uploading}
        >
          Upload .slp files
          <VisuallyHiddenInput type="file" multiple onChange={uploadFiles} />
        </Button>
        {uploading && (
          <>
            <Typography>
              Uploading... {uploadProgress} of {uploadProgressTotal}
            </Typography>
            <LinearProgress
              variant="determinate"
              value={(uploadProgress / uploadProgressTotal) * 100}
            />
          </>
        )}
      </Box>
      <Grid container spacing={2} paddingY={4} justifyContent="space-between">
        <Grid item xs={4}>
          <Stack spacing={2}>
            <Box>
              <InputLabel>Filter by...</InputLabel>
              <Select
                value={selectedFilterOption}
                onChange={e =>
                  setSelectedFilterOption(e.target.value as string)
                }
                sx={{
                  width: '150px',
                  marginRight: 2,
                }}
                size="small"
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="top8">Top 8</MenuItem>
                <MenuItem value="entrant">Entrant</MenuItem>
              </Select>
              {selectedFilterOption === 'entrant' && (
                <Select
                  value={selectedFilterSubOption}
                  onChange={e =>
                    setSelectedFilterSubOption(e.target.value as string)
                  }
                  sx={{
                    width: '150px',
                  }}
                  size="small"
                >
                  {uniqueEntrants.map(entrant => (
                    <MenuItem value={entrant.toString()}>
                      {entrant.toString()}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </Box>
            <Box>
              <InputLabel>Sort by...</InputLabel>
              <Select
                value={selectedSortOption}
                onChange={e => setSelectedSortOption(e.target.value as string)}
                sx={{
                  width: '150px',
                  marginRight: 2,
                }}
                size="small"
              >
                <MenuItem value="round">Round</MenuItem>
                <MenuItem value="time">Time</MenuItem>
              </Select>
              {selectedSortOption === 'time' && (
                <Select
                  value={selectedSortSubOption}
                  onChange={e =>
                    setSelectedSortSubOption(e.target.value as string)
                  }
                  sx={{
                    width: '150px',
                  }}
                  size="small"
                >
                  <MenuItem value="desc">Latest</MenuItem>
                  <MenuItem value="asc">Earliest</MenuItem>
                </Select>
              )}
            </Box>
            {pagination}
            {sets.map(set => (
              <Card variant="outlined" sx={{ padding: 2 }} key={set.id}>
                <Typography variant="h5">{set.roundText}</Typography>
                {/* <Typography variant="h6">
                {set.entrants[0].name} {isWinner(set, set.entrants[0])}
              </Typography>
              <Typography variant="h6">vs</Typography>
              <Typography variant="h6">
                {set.entrants[1].name} {isWinner(set, set.entrants[1])}
              </Typography> */}
                <Typography variant="h6">{set.displayScore}</Typography>
                <Typography variant="h6">
                  {format(parseInt(set.completedAt, 10), 'P p')}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={2} sx={{ position: 'sticky', top: '100px' }}>
            <Typography variant="body1"></Typography>
            <Button variant="outlined" size="large">
              Assign slp game to start.gg set:
            </Button>
          </Stack>
        </Grid>

        <Grid item xs={4}>
          <Stack spacing={2}>
            {
              <Box>
                <InputLabel>Filter by...</InputLabel>
                <Select
                  value={selectedSlpFilterOption}
                  onChange={e =>
                    setSelectedSlpFilterOption(e.target.value as string)
                  }
                  sx={{
                    width: '150px',
                    marginRight: 2,
                  }}
                  size="small"
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="character">Character</MenuItem>
                </Select>
                {selectedSlpFilterOption === 'character' && (
                  <Select
                    value={selectedSlpFilterSubOption}
                    onChange={e =>
                      setSelectedSlpFilterSubOption(e.target.value as string)
                    }
                    sx={{
                      width: '150px',
                    }}
                    size="small"
                  >
                    {getAllCharacters().map(character => (
                      <MenuItem value={character.name}>
                        {character.name}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              </Box>
            }
            <Box>
              <InputLabel>Sort by...</InputLabel>
              <Select
                value={selectedSlpSortOption}
                onChange={e =>
                  setSelectedSlpSortOption(e.target.value as string)
                }
                sx={{
                  width: '150px',
                  marginRight: 2,
                }}
                size="small"
              >
                <MenuItem value="time">Time</MenuItem>
              </Select>
              {selectedSlpSortOption === 'time' && (
                <Select
                  value={selectedSlpSortSubOption}
                  onChange={e =>
                    setSelectedSlpSortSubOption(e.target.value as string)
                  }
                  sx={{
                    width: '150px',
                  }}
                  size="small"
                >
                  <MenuItem value="desc">Latest</MenuItem>
                  <MenuItem value="asc">Earliest</MenuItem>
                </Select>
              )}
            </Box>
            {games?.length === 0 && <Typography>No games found.</Typography>}

            {games?.map(game => (
              <Card variant="outlined" sx={{ padding: 2 }} key={game.id}>
                <Box display="flex" alignItems="center">
                  {/* <Typography variant="h6">
                  {format(parseInt(game.startAt, 10), 'P p')}
                </Typography> */}
                  {/* <Typography variant="h6">
                  {game.slpPlayers[0].name} - {game.slpPlayers[0].characterName}{' '}
                  {game.slpPlayers[0].characterColorName} 
                </Typography> */}
                  {game.slpPlayers[0].isWinner ? (
                    <CheckIcon />
                  ) : (
                    <Box sx={{ marginX: 1.5 }} />
                  )}
                  <img
                    src={`../images/melee-stock-icons/${game.slpPlayers[0].characterName} - ${game.slpPlayers[0].characterColorName}.png`}
                    alt={`${game.slpPlayers[0].characterName} - ${game.slpPlayers[0].characterColorName}`}
                    width="40"
                    height="40"
                  />
                  <Typography variant="h6" sx={{ marginX: 2 }}>
                    vs{' '}
                  </Typography>
                  {/* <Typography variant="h6">
                  {game.slpPlayers[1].name} - {game.slpPlayers[1].characterName}{' '}
                  {game.slpPlayers[1].characterColorName}
                </Typography> */}
                  <img
                    src={`../images/melee-stock-icons/${game.slpPlayers[1].characterName} - ${game.slpPlayers[1].characterColorName}.png`}
                    alt={`${game.slpPlayers[1].characterName} - ${game.slpPlayers[1].characterColorName}`}
                    width="40"
                    height="40"
                  />
                  {game.slpPlayers[1].isWinner && <CheckIcon />}
                </Box>
                <Typography variant="h6">{game.stage}</Typography>
              </Card>
            ))}
          </Stack>
        </Grid>
      </Grid>
      {pagination}
      <Button
        variant="outlined"
        onClick={handleDeleteTournament}
        sx={{ color: 'red', marginY: 5 }}
        size="large"
      >
        Delete
      </Button>
    </Box>
  );
};

export default Tournament;
