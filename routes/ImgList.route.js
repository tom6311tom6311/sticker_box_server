import express from 'express';
import fs from 'fs';
import nodejieba from 'nodejieba';
import matchSorter from 'match-sorter';
import AppConfig from '../const/AppConfig.const';
import randomChoice from '../util/randomChoice.util';

const imgListRouter = express.Router();

imgListRouter.get('/', (req, res) => {
  const { searchTerm } = req.query;
  // console.log(nodejieba.cut(searchTerm));
  fs.readdir(AppConfig.IMG_DIR, (err, fileNames) => {
    let imgList = [];
    if (err) {
      console.error(`ERROR [ImgList]: ${err}`);
    } else {
      const candidates = fileNames.filter(fn => AppConfig.ALLOWED_FORMAT.some(f => fn.endsWith(f)));
      if (searchTerm !== '') imgList = matchSorter(candidates, searchTerm).slice(0, AppConfig.DEFAULT_IMG_LIST_SIZE);
      while (imgList.length < AppConfig.DEFAULT_IMG_LIST_SIZE) {
        const [n] = randomChoice(candidates, 1);
        if (imgList.findIndex(e => e === n) === -1) imgList.push(n);
      }
    }

    res.json({
      imgList,
    });
  });
});

module.exports = imgListRouter;
