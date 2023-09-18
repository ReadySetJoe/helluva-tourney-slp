import { useSession } from 'next-auth/react';
import React from 'react';

import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Box, Button, Stack, Typography } from '@mui/material';

const Landing = () => {
  const { data: session } = useSession();

  return (
    <Stack spacing={5} paddingTop={5}>
      <Typography variant="h3">Welcome to ht-slp</Typography>
      <Typography variant="h4">A Slippi tournament manager</Typography>
      <Typography variant="h5">
        ht-slp is a tool for managing your Slippi tournaments. You can create
        tournaments, upload Slippi replays, and view tournament results.
      </Typography>
      <Typography variant="h5">
        To get started, sign in or create a new tournament.
      </Typography>

      <Box sx={{ width: 'fit-content' }}>
        <Button
          variant="contained"
          href="/api/auth/signin"
          disabled={!!session}
          startIcon={<CheckCircleIcon />}
        >
          {!!session ? 'Signed in!' : 'Sign in'}
        </Button>
      </Box>
      <Box sx={{ width: 'fit-content' }}>
        <Button variant="contained" href="/tournament/create">
          Create a tournament
        </Button>
      </Box>
    </Stack>
  );
};

export default Landing;
