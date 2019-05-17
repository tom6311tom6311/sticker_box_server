import express from 'express';
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

module.exports = imgListRouter;
