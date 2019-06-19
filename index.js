/* eslint-disable no-bitwise */
import { GraphQLServer, PubSub } from 'graphql-yoga';
import db from './data/db/db.const';
import Query from './src/resolvers/Query';
// import Mutation from './resolvers/Mutation'
// import Subscription from './resolvers/Subscription'
// import User from './resolvers/User'
// import Post from './resolvers/Post'
// import Comment from './resolvers/Comment'

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
  },
  context: {
    db,
    sessions: {},
    pubsub,
  },
});

server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`);
});
