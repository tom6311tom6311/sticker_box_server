/* eslint-disable no-bitwise */
import express from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import { GraphQLServer, PubSub } from 'graphql-yoga';
import AppConfig from './const/AppConfig.const';
import db from './data/db/db.const';
import imgListRouter from './routes/ImgList.route';
import TermMatcher from './util/TermMatcher.class';
import Query from './src/resolvers/Query';
import Mutation from './src/resolvers/Mutation';
import TagStore from './src/class/TagStore/TagStore.class';
import StickerStore from './src/class/StickerStore/StickerStore.class';
// import Subscription from './resolvers/Subscription'

// initialize term-matcher
const tagTerms = Object
  .values(db.tags)
  .map(({ tagID, key }) => ({ id: tagID, term: key }));

TermMatcher.loadWordLib(() => {
  TermMatcher.updateTerms(AppConfig.TERM_LIB.TAG, tagTerms);
  tagTerms.forEach(({ id: tagID }) => {
    const { stickerIDs } = TagStore.getTag(tagID);
    const stickerTerms = stickerIDs
      .map(stickerID => StickerStore.getSticker(stickerID))
      .map(({ stickerID, description }) => ({ id: stickerID, term: description }));
    TermMatcher.updateTerms(`${AppConfig.TERM_LIB.STICKER}_${tagID}`, stickerTerms);
  });
  console.log('TermMatcher initialized.');
});

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: './src/schema.graphql',
  resolvers: {
    Query,
    Mutation,
  },
  context: {
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

server.start({ port: process.env.PORT | 4000 }, () => {
  console.log(`The server is up on port ${process.env.PORT | 4000}!`);
});
