import { ApolloProvider } from '@apollo/client';
import React from 'react';
import '../styles/globals.css';

import client from '../graphql/apollo-client';

export default function App({ Component, pageProps }) {
  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
}
