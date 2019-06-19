const AppConfig = {
  IMG_DIR: `${__dirname}/../data/imgs/`,
  WORD2VEC_MODEL_PATH: `${__dirname}/../data/models/zh.vec`,
  ALLOWED_FORMAT: ['.jpg', '.png', '.gif'],
  DEFAULT_IMG_LIST_SIZE: 9,
  WORD_VECTOR_DIM: 300,
  FORMAT: {
    USER_ID: new RegExp('^[a-zA-Z_][a-z0-9]{7,19}$'),
    PASSWORD: new RegExp('^[a-z0-9]{8,20}$'),
  },
};

export default AppConfig;
