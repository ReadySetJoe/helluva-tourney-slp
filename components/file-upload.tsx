import { isBefore } from 'date-fns';
import { ChangeEventHandler, useState } from 'react';

import { SlippiGame } from '@slippi/slippi-js';

import styles from '../styles/Home.module.css';

const sortByStartAt = (a: SlippiGame, b: SlippiGame) => {
  const startAtA = a.getMetadata().startAt;
  const startAtB = b.getMetadata().startAt;
  return isBefore(new Date(startAtA), new Date(startAtB)) ? 1 : -1;
};

// File upload component
const FileUpload = ({ setGames }) => {
  const [loading, setLoading] = useState(false);

  const handleSlpFiles: ChangeEventHandler<HTMLInputElement> = async e => {
    setLoading(true);

    const setupReader = (file: File) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => {
          const contents = e.target.result;
          const game = new SlippiGame(contents);
          resolve(game);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(file);
      });
    };

    const filePromises = Array.from(e.target.files).map(file => {
      return setupReader(file);
    });

    const gamesData = (await Promise.all(filePromises))
      .filter((g: SlippiGame) => !!g.getMetadata()?.startAt)
      .sort(sortByStartAt) as SlippiGame[];

    setGames(gamesData);
    setLoading(false);
  };

  return (
    <div>
      <input
        type="file"
        id="file-upload"
        hidden
        onChange={handleSlpFiles}
        multiple
        accept=".slp"
      />
      <label className={styles.button} htmlFor="file-upload">
        Choose a file
      </label>

      {loading && <div className={styles.loader} />}
    </div>
  );
};

export default FileUpload;
