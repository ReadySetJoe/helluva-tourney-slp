import { signIn, signOut, useSession } from 'next-auth/react';

import styles from '../styles/Home.module.css';

export default function Login() {
  const { data: session } = useSession();
  if (session) {
    return (
      <div style={{ display: 'flex', alignItems: 'center' }}>
        Signed in as {session.user.email}{' '}
        <img
          src={session.user.image}
          height={50}
          width={50}
          style={{ borderRadius: '100%', padding: 5 }}
        />
        <button onClick={() => signOut()} className={styles.button}>
          Sign out
        </button>
      </div>
    );
  }
  return (
    <button onClick={() => signIn()} className={styles.button}>
      Sign in
    </button>
  );
}
