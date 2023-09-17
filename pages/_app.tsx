import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import '../styles/globals.css';

import { SessionProvider } from 'next-auth/react';
import React from 'react';

import { ApolloProvider } from '@apollo/client';

import client from '../lib/apollo';

export default function App({
  Component,
  pageProps: { session, ...pageProps },
}: {
  Component: React.ElementType;
  pageProps: { session: any; [key: string]: any };
}) {
  return (
    <ApolloProvider client={client}>
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    </ApolloProvider>
  );
}
