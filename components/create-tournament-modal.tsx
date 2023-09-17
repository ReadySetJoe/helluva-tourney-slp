import gql from 'graphql-tag';
import { useState } from 'react';

import { useLazyQuery, useMutation } from '@apollo/client';
import { Modal } from '@mui/material';

import styles from '../styles/Home.module.css';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

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

const CreateTournamentModal = ({ open, setOpen }) => {
  const [tournamentUrl, setTournamentUrl] = useState<string>('');

  const slug = getSlugFromTournamentUrl(tournamentUrl);

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
    <Modal open={open} sx={modalStyle} onClose={() => setOpen(false)}>
      <>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <input
            type="text"
            value={tournamentUrl}
            onChange={e => setTournamentUrl(e.target.value)}
            style={{ padding: '0.5rem' }}
            placeholder="https://www.start.gg/tournament/..."
          />
          <button
            className={styles.button}
            onClick={async () => {
              await fetchGgTournament();
            }}
          >
            Get Tournament Data
          </button>
        </div>
        {tournamentUrl && !slug && (
          <p style={{ color: 'red' }}>Not a valid URL</p>
        )}
        {loadingTournamentData && <p>Loading...</p>}
        {ggTournament && (
          <div>
            <p>Tournament name: {ggTournament.tournament.name}</p>
            <button
              className={styles.button}
              onClick={async () => {
                createTournament();
              }}
            >
              Add to database
            </button>
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
      </>
    </Modal>
  );
};

export default CreateTournamentModal;
