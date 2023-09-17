import { getServerSession } from 'next-auth';

import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import resolvers from '../../graphql/resolvers';
import typeDefs from '../../graphql/schema';
import prisma from '../../lib/prisma';
import allowCors from '../../utils/cors';
import { authOptions } from './auth/[...nextauth]';

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
});

const getLoggedInUser = async (req, res, prisma) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: {
      email: session.user.email,
    },
  });
  if (user) {
    return user;
  }
  return null;
};

const handler = startServerAndCreateNextHandler(apolloServer, {
  context: async (req, res) => ({
    req,
    res,
    user: await getLoggedInUser(req, res, prisma),
    models: prisma,
  }),
});

export default allowCors(handler);
