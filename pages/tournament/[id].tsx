import { useRouter } from 'next/router';

import { gql, useMutation, useQuery } from '@apollo/client';
import { Box, Button, Card, Grid, Stack, Typography } from '@mui/material';

const tournamentQuery = gql`
  query tournament($id: Int!) {
    tournament(id: $id) {
      id
      name
      events {
        id
        sets {
          round
          id
          entrants {
            id
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
  const router = useRouter();
  const id = parseInt(router.query.id as string, 10);

  const { data: tournamentData } = useQuery(tournamentQuery, {
    variables: { id },
  });
  const tournament = tournamentData?.tournament;

  const [deleteTournament] = useMutation(deleteTournamentQuery, {
    variables: { id },
  });

  const handleDeleteTournament = async () => {
    await deleteTournament();
    router.push('/tournament');
  };

  return (
    <Box>
      <Typography variant="h3">{tournament?.name}</Typography>
      <Stack spacing={2} padding={6}>
        {tournament?.events[0].sets.map(set => (
          <Card variant="outlined" sx={{ width: '250px', padding: 2 }}>
            <Typography variant="h5">{set.round}</Typography>

            <Typography variant="h6">{set.entrants[0].name}</Typography>
            <Typography variant="h6">vs</Typography>
            <Typography variant="h6">{set.entrants[1].name}</Typography>
          </Card>
        ))}
      </Stack>
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
