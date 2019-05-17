import express from 'express';
import morgan from 'morgan';
import fs from 'fs';
import AppConfig from './const/AppConfig.const';
import imgListRouter from './routes/ImgList.route';
import TermMatcher from './util/TermMatcher.class';

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


// configure sever application and port
const app = express();
const port = process.env.PORT || 5000;

// logging middleware
app.use(morgan('combined'));

// middleware for serving images and handling image name query
app.use('/imgs', [imgListRouter, express.static(AppConfig.IMG_DIR)]);

// // middleware handling image name query
// app.use('/imgs', imgListRouter);


// start server
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
