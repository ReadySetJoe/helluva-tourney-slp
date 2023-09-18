import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import Head from 'next/head';
import React from 'react';

import { ApolloProvider } from '@apollo/client';
import { AppBar, Container, Toolbar } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import Footer from '../components/footer';
import Header from '../components/header';
import client from '../lib/apollo';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
  typography: {
    fontFamily: 'monospace',
  },
});

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: React.ElementType;
  pageProps: { session: any; [key: string]: any };
}) {
  return (
    <ApolloProvider client={client}>
      <Head>
        <title>HTSLP</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionProvider session={session}>
        <ThemeProvider theme={darkTheme}>
          <AppBar position="static">
            <Header />
          </AppBar>
          <Container maxWidth="lg" sx={{ paddingTop: 5, minHeight: '100vh' }}>
            <CssBaseline />
            <Component {...pageProps} />
          </Container>
          <Footer />
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
