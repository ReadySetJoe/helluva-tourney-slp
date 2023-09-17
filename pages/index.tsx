import { useState } from 'react';

import { gql, useLazyQuery, useQuery } from '@apollo/client';
import { SlippiGame } from '@slippi/slippi-js';

import CreateTournamentModal from '../components/create-tournament-modal';
import FileUpload from '../components/file-upload';
import Footer from '../components/footer';
import Header from '../components/header';
import { getCharacterColorName, getCharacterName } from '../helpers/character';
import styles from '../styles/Home.module.css';

const myTournamentsQuery = gql`
  query myTournaments {
    myTournaments {
      id
      name
      event {
        id
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

export default function Home() {
  const [games, setGames] = useState<SlippiGame[]>([]);
  const [createTournamentModalOpen, setCreateTournamentModalOpen] =
    useState<boolean>(true);
  const [selectedTournament, setSelectedTournament] = useState<string>('');

  const { data: myTournamentsData } = useQuery(myTournamentsQuery);

  console.log('myTournamentsData', myTournamentsData);

  return (
    <div className={styles.container}>
      <CreateTournamentModal
        open={createTournamentModalOpen}
        setOpen={setCreateTournamentModalOpen}
      />
      <Header />
      <main>
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <div>
            <h1>My Tournaments:</h1>
            <select>
              <option>Choose a tournament</option>
              {myTournamentsData &&
                myTournamentsData.myTournaments.map(tournament => (
                  <option value={tournament.id}>{tournament.name}</option>
                ))}
            </select>
            <button
              className={styles.button}
              onClick={() => setCreateTournamentModalOpen(true)}
            >
              Create new tournament
            </button>
          </div>
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
