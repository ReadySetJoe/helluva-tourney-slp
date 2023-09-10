import { gql, useLazyQuery } from '@apollo/client';
import { SlippiGame } from '@slippi/slippi-js';
import Head from 'next/head';
import { useState } from 'react';

import FileUpload from '../components/file-upload';
import Footer from '../components/footer';
import styles from '../styles/Home.module.css';
import { getCharacterColorName, getCharacterName } from '../helpers/character';

const getTournamentQuery = gql`
  query getTournament($slug: String!) {
    getTournament(slug: $slug) {
      id
      name
      event {
        id
        name
        sets {
          round
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

const getSlugFromTournamentUrl = (url: string) => {
  if (!url?.startsWith('https://www.start.gg/tournament/')) return;
  return url.split('/tournament/')[1].split('/')[0];
};

export default function Home() {
  const [games, setGames] = useState<SlippiGame[]>([]);
  const [tournamentUrl, setTournamentUrl] = useState<string>('');

  const slug = getSlugFromTournamentUrl(tournamentUrl);

  const [getTournament, { loading, data }] = useLazyQuery(getTournamentQuery, {
    variables: { slug },
  });

  return (
    <div className={styles.container}>
      <Head>
        <title>helluva-tourney-slp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h1>HELLUVA_TOURNEY.SLP</h1>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div>
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
          </div>

          <div>
            <h1>Get Tournament Data</h1>
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
                  await getTournament();
                }}
              >
                Get Tournament Data
              </button>
            </div>
            {tournamentUrl && !slug && (
              <p style={{ color: 'red' }}>Not a valid URL</p>
            )}
            {loading && <p>Loading...</p>}
            {data && <p>Data was found!</p>}
            {data?.getTournament && (
              <div>
                <p>Tournament name: {data.getTournament.name}</p>
                <p>Number of sets: {data.getTournament.event?.sets.length}</p>
                <ul>
                  {data.getTournament.event?.sets.map(set => (
                    <li key={set.id}>
                      {set.round} -{' '}
                      {set.entrants.map(entrant => entrant.name).join(' vs ')}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
