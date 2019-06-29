const AppConfig = {
  IMG_DIR: `${__dirname}/../data/imgs/`,
  WORD2VEC_MODEL_PATH: `${__dirname}/../data/models/zh.vec`,
  ALLOWED_FORMAT: ['jpg', 'png', 'gif'],
  DEFAULT_IMG_SEARCH_RESP_SIZE: 9,
  DEFAULT_TAG_SEARCH_RESP_SIZE: 9,
  WORD_VECTOR_DIM: 300,
  FORMAT: {
    USER_ID: new RegExp('^[a-zA-Z_][a-z0-9]{7,19}$'),
    PASSWORD: new RegExp('^[a-z0-9]{8,20}$'),
    UUID: new RegExp(/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i),
    CHINESE_ONLY: new RegExp('^[\u4e00-\u9fa5]+$'),
  },
  TERM_LIB: {
    STICKER: 'STICKER',
    TAG: 'TAG',
  },
};

export default AppConfig;
