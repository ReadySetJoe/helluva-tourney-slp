import gql from 'graphql-tag';
import { useRouter } from 'next/router';
import { useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { Button, FormControl, FormLabel, TextField } from '@mui/material';

const getSlugFromTournamentUrl = (url: string) => {
  if (!url?.startsWith('https://www.start.gg/tournament/')) return;
  return url.split('/tournament/')[1].split('/')[0];
};

const fetchGgTournamentQuery = gql`
  query fetchGgTournament($slug: String!) {
    fetchGgTournament(slug: $slug) {
      tournament {
        name
      }
      event {
        name
        sets {
          nodes {
            fullRoundText
            slots {
              entrant {
                id
                name
              }
            }
          }
        }
      }
    }
  }
`;

const createTournamentQuery = gql`
  mutation createTournament($slug: String!) {
    createTournament(slug: $slug) {
      id
    }
  }
`;

const CreateTournament = () => {
  const [tournamentUrl, setTournamentUrl] = useState<string>('');

  const router = useRouter();

  const slug = getSlugFromTournamentUrl(tournamentUrl);
  const slugIsInvalid = !!tournamentUrl && !slug;

  const [
    fetchGgTournament,
    { loading: loadingTournamentData, data: tournamentData },
  ] = useLazyQuery(fetchGgTournamentQuery, {
    variables: { slug },
  });

  const ggTournament = tournamentData?.fetchGgTournament;

  const [createTournament] = useMutation(createTournamentQuery, {
    variables: { slug },
  });

  return (
    <FormControl>
      <FormLabel>Enter a start.gg tournament URL:</FormLabel>
      <TextField
        value={tournamentUrl}
        onChange={e => {
          setTournamentUrl(e.target.value);
        }}
        placeholder="https://www.start.gg/tournament/..."
        error={slugIsInvalid}
        helperText={
          slugIsInvalid && 'Please enter a valid start.gg tournament URL'
        }
      />
      <Button
        onClick={async () => {
          await fetchGgTournament();
        }}
        disabled={!tournamentUrl || !slug}
      >
        Get Tournament Data
      </Button>
      {loadingTournamentData && <p>Loading...</p>}
      {ggTournament && (
        <div>
          <p>Tournament name: {ggTournament.tournament.name}</p>
          <Button
            onClick={async () => {
              const res = await createTournament();
              router.push(`/tournament/${res.data.createTournament.id}`);
            }}
          >
            Add to database
          </Button>
          <p>Number of sets: {ggTournament.event?.sets.nodes.length}</p>
          <ul>
            {ggTournament.event?.sets.nodes.map(set => (
              <li>
                {set.fullRoundText} -{' '}
                {set.slots.map(slot => slot.entrant.name).join(' vs. ')}
              </li>
            ))}
          </ul>
        </div>
      )}
    </FormControl>
  );
};

export default CreateTournament;
