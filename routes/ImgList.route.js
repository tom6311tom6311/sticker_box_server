import express from 'express';
import multer from 'multer';
import AppConfig from '../const/AppConfig.const';
import TermMatcher from '../util/TermMatcher.class';

const imgListRouter = express.Router();

imgListRouter.get('/', (req, res) => {
  const { searchTerm } = req.query;
  const imgList = TermMatcher.match(searchTerm || '', AppConfig.DEFAULT_IMG_LIST_SIZE);

  res.json({
    imgList,
  });
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AppConfig.IMG_DIR);
  },
  filename: (req, file, cb) => {
    TermMatcher.updateTerms([file.originalname]);
    cb(null, file.originalname);
  },
});

imgListRouter.post(
  '/',
  multer({ storage }).single('newImg'), (req, res) => {
    res.json({
      status: 'OK',
    });
  },
);

module.exports = imgListRouter;
