import { SlippiGame } from '@slippi/slippi-js';
import Head from 'next/head';
import { useState } from 'react';

import FileUpload from '../components/file-upload';
import Footer from '../components/footer';
import styles from '../styles/Home.module.css';

export default function Home() {
  const [games, setGames] = useState<SlippiGame[]>([]);

  return (
    <div className={styles.container}>
      <Head>
        <title>helluva-tourney-slp</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <h3 className={styles.description}>
          Welcome to helluva-tourney-slp AKA ht-slp AKA hot slop!
        </h3>

        <div>
          <FileUpload setGames={setGames} />
          <p>Number of files uploaded: {games.length}</p>
        </div>
      </main>

      <Footer />
    </div>
  );
}
