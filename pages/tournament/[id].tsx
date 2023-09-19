import { format } from 'date-fns';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import { CloudUpload } from '@mui/icons-material';
import {
  Box,
  Button,
  Card,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import { SlippiGame } from '@slippi/slippi-js';

import { getSlpPlayer } from '../../graphql/resolvers/slp-game';
import { getStageName } from '../../helpers/stageUtils';
import {
  filterByEntrant,
  getUniqueEntrants,
  sortByRound,
  sortByTime,
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
      }
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
  const [uploading, setUploading] = useState(false);

  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  const { data: tournamentData } = useQuery(tournamentQuery, {
    variables: { id },
  });
  const tournament = tournamentData?.tournament;
  const uniqueEntrants = getUniqueEntrants(tournament?.events[0].sets || []);

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

    for (const file of e.target.files) {
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

      const p1 = settings.players[0];
      const p2 = settings.players[1];

      const slpPlayer1 = getSlpPlayer(p1, metadata, 'Player 1');
      const slpPlayer2 = getSlpPlayer(p2, metadata, 'Player 2');

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

  const maxPage = Math.floor(tournament?.events[0].sets.length / 10);
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
        onClick={() =>
          setSetsPage(
            maxPage - (tournament?.events[0].sets.length % 10 === 0 ? 1 : 0)
          )
        }
        disabled={
          setsPage ===
          maxPage - (tournament?.events[0].sets.length % 10 === 0 ? 1 : 0)
        }
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

  return (
    <Box>
      <Typography variant="h3">{tournament?.name}</Typography>
      <Grid container spacing={2} paddingY={6} justifyContent="space-between">
        <Stack spacing={2}>
          <Box>
            <InputLabel>Filter by...</InputLabel>
            <Select
              value={selectedFilterOption}
              onChange={e => setSelectedFilterOption(e.target.value as string)}
              sx={{
                width: '200px',
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
                  width: '200px',
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
                width: '200px',
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
                  width: '200px',
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
              <Typography variant="h6">
                {format(parseInt(set.completedAt, 10), 'P p')}
              </Typography>
              <Typography variant="h6">
                {set.entrants[0].name} {isWinner(set, set.entrants[0])}
              </Typography>
              <Typography variant="h6">vs</Typography>
              <Typography variant="h6">
                {set.entrants[1].name} {isWinner(set, set.entrants[1])}
              </Typography>
            </Card>
          ))}
        </Stack>
        <Box>
          <Stack spacing={2}>
            <Typography variant="h6">
              Upload .slp files:{' '}
              <Button
                component="label"
                variant="contained"
                startIcon={<CloudUpload />}
                disabled={uploading}
              >
                Upload file
                <VisuallyHiddenInput
                  type="file"
                  multiple
                  onChange={uploadFiles}
                />
              </Button>
            </Typography>
            {uploading && <Typography>Uploading...</Typography>}
            {slpGames?.length === 0 && <Typography>No games found.</Typography>}
            {slpGames?.map(game => (
              <Card variant="outlined" sx={{ padding: 2 }} key={game.id}>
                <Typography variant="h6">{game.stage}</Typography>
                {/* <Typography variant="h6">
                  {format(parseInt(game.startAt, 10), 'P p')}
                </Typography> */}
                <Typography variant="h6">
                  {game.slpPlayers[0].name} - {game.slpPlayers[0].characterName}{' '}
                </Typography>
                <Typography variant="h6">
                  {game.slpPlayers[0].characterColorName} vs{' '}
                </Typography>
                <Typography variant="h6">
                  {game.slpPlayers[1].name} - {game.slpPlayers[1].characterName}{' '}
                  {game.slpPlayers[1].characterColorName}
                </Typography>
              </Card>
            ))}
          </Stack>
        </Box>
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
