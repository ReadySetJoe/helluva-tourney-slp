import Head from 'next/head';
import Login from './login';

const Header = () => {
  return (
    <header>
      <Head>
        <title>HTSLP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1>Let's make some magic</h1>
      <Login />
    </header>
  );
};

export default Header;
