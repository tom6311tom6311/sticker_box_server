import express from 'express';
import morgan from 'morgan';
import AppConst from './const/AppConfig.const';
import imgListRouter from './routes/ImgList.route';


// configure sever application and port
const app = express();
const port = process.env.PORT || 5000;

// logging middleware
app.use(morgan('combined'));

// middleware for serving images
app.use('/imgs', express.static(AppConst.IMG_DIR));

// middleware handling image name query
app.use('/img_list', imgListRouter);


// start server
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
