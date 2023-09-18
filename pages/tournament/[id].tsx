import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { gql, useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Button,
  Card,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from '@mui/material';

import {
  filterByEntrant,
  getUniqueEntrants,
  sortByRound,
  top8,
} from '../../helpers/utils';

const tournamentQuery = gql`
  query tournament($id: Int!) {
    tournament(id: $id) {
      id
      name
      events {
        id
        sets {
          id
          round
          roundText
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

const Tournament = () => {
  const [setsPage, setSetsPage] = useState(0);
  const [sets, setSets] = useState([]);
  const [selectedFilterOption, setSelectedFilterOption] = useState(
    'all' as string
  );
  const [selectedFilterSubOption, setSelectedFilterSubOption] = useState(
    '' as string
  );

  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  const { data: tournamentData } = useQuery(tournamentQuery, {
    variables: { id },
  });
  const tournament = tournamentData?.tournament;
  const uniqueEntrants = getUniqueEntrants(tournament?.events[0].sets || []);

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

    const sorted = sortByRound(filteredSets);
    setSets(sorted.slice(setsPage * 10, setsPage * 10 + 10));
  }, [tournament, setsPage, selectedFilterOption, selectedFilterSubOption]);

  useEffect(() => {
    setSetsPage(0);
  }, [selectedFilterOption, selectedFilterSubOption]);

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
          {pagination}
          {sets.map(set => (
            <Card
              variant="outlined"
              sx={{ width: '250px', padding: 2 }}
              key={set.id}
            >
              <Typography variant="h5">{set.roundText}</Typography>
              <Typography variant="h6">
                {set.entrants[0].name} {isWinner(set, set.entrants[0])}
              </Typography>
              <Typography variant="h6">vs</Typography>
              <Typography variant="h6">
                {set.entrants[1].name} {isWinner(set, set.entrants[1])}
              </Typography>
            </Card>
          ))}
        </Stack>{' '}
        <Box>
          <InputLabel id="demo-simple-select-label">Filter by...</InputLabel>
          <Select
            value={selectedFilterOption}
            onChange={e => setSelectedFilterOption(e.target.value as string)}
            sx={{
              width: '200px',
              marginRight: 2,
            }}
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
          <Typography variant="h5">Upload .slp files:</Typography>
        </Box>
      </Grid>
      {pagination}
      <Button
        variant="outlined"
        onClick={handleDeleteTournament}
        sx={{ color: 'red' }}
      >
        Delete
      </Button>
    </Box>
  );
};

export default Tournament;
