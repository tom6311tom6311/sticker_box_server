/* eslint-disable no-bitwise */
import fs from 'fs';
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import AppConfig from './const/AppConfig.const';
import imgListRouter from './routes/ImgList.route';
import TermMatcher from './util/TermMatcher.class';
import db from './data/db/db.const';
// import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
// import Subscription from './resolvers/Subscription'
// import User from './resolvers/User'
// import Post from './resolvers/Post'
// import Comment from './resolvers/Comment'

// initialize term-matcher
fs.readdir(AppConfig.IMG_DIR, (err, fileNames) => {
  if (err) {
    console.error(`ERROR [ImgList]: ${err}`);
  } else {
    const terms = fileNames.filter(fn => AppConfig.ALLOWED_FORMAT.some(f => fn.endsWith(f)));
    TermMatcher.loadWordLib(() => {
      TermMatcher.updateTerms(terms);
      console.log('TermMatcher initialized.');
    });
  }
});

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Mutation,
  },
  context: {
    db,
    sessions: {},
    pubsub,
  },
});

// logging middleware
server.express.use(morgan('combined'));

// to support URL-encoded bodies
server.express.use(bodyParser.urlencoded({ extended: false }));
// to support JSON-encoded bodies
server.express.use(bodyParser.json());

// middleware for serving images and handling image name query
server.express.use('/imgs', [imgListRouter, express.static(AppConfig.IMG_DIR)]);

// // middleware handling image name query
// app.use('/imgs', imgListRouter);

server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`);
});
