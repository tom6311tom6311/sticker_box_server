import express from 'express';
import multer from 'multer';
import AppConfig from '../const/AppConfig.const';

const imgListRouter = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AppConfig.IMG_DIR);
  },
  filename: (req, file, cb) => {
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
