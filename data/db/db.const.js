/* eslint-disable quote-props */
const users = {
  'system': {
    userID: 'system',
    password: 'system',
    name: 'admin',
    owntagIDs: ['公開', '壓力', '開心', '傷心', '加油', '再見', '崩潰', '神奇', '好朋友', '可愛', '孤單', '狗', '貓', '厲害', '感謝', '勝利', '無辜', '生氣', '驚嚇', '瘋狂', '運動', '飢餓', '吃'],
    subscribedtagIDs: [],
  },
  'test01': {
    userID: 'test01',
    password: 'test01',
    name: 'user1',
    owntagIDs: ['312神手團', '903', 'FULLYBnB', '白蘭氏'],
    subscribedtagIDs: ['公開', '學校', '開心', '傷心', 'Cars', 'ToyStory'],
  },
  'test02': {
    userID: 'test02',
    password: 'test02',
    name: 'user2',
    owntagIDs: ['WL57_314', 'NTUBSEb04', 'blablabla'],
    subscribedtagIDs: ['公開', '開心', '傷心', 'FULLYBnB', '白蘭氏', 'ToyStory', 'findingNemo', 'theIncredibles'],
  },
  'disney@12345': {
    userID: 'disney@12345',
    password: 'DisneYIsTheBEST',
    name: 'Disney',
    owntagIDs: ['Cars', 'ToyStory', 'aBugLife', 'findingNemo', 'theIncredibles'],
    subscribedtagIDs: ['公開', '開心', '傷心'],
  },
};

const stickers = {
  'cars0001': {
    stickerID: 'cars0001',
    ownerID: 'qa4510qa',
    tagIDs: ['Cars', '努力'],
    description: 'Macqueen won with his tongue in cars1',
    type: 'jpg',
  },
  'system0001': {
    stickerID: 'system0001',
    ownerID: 'qa4510qa',
    tagIDs: ['壓力', '崩潰'],
    description: '不想聽壓力大',
    type: 'jpg',
  },
  'system0002': {
    stickerID: 'system0002',
    ownerID: 'qa4510qa',
    tagIDs: ['傷心', '神奇'],
    description: '不敢相信難過悲傷神奇',
    type: 'jpg',
  },
  'system0003': {
    stickerID: 'system0003',
    ownerID: 'qa4510qa',
    tagIDs: ['加油', '再見'],
    description: '你好加油再見',
    type: 'png',
  },
  'system0004': {
    stickerID: 'system0004',
    ownerID: 'qa4510qa',
    tagIDs: ['加油', '好朋友'],
    description: '兄弟好朋友加油努力',
    type: 'jpg',
  },
  'system0005': {
    stickerID: 'system0005',
    ownerID: 'qa4510qa',
    tagIDs: ['再見'],
    description: '再見掰晚安',
    type: 'png',
  },
};

const tags = {
  '努力': {
    tagID: '努力',
    ownerID: 'system',
    stickerIDs: ['cars0001'],
    key: 'l;a;fjnegklde;fio',
  },
  '壓力': {
    tagID: '壓力',
    ownerID: 'system',
    stickerIDs: ['system0001'],
    key: 'eafgaerojgkjdsnv;a',
  },
  '崩潰': {
    tagID: '崩潰',
    ownerID: 'system',
    stickerIDs: ['system0001'],
    key: 'ows;idhfakerfg;iaeg',
  },
  '神奇': {
    tagID: '神奇',
    ownerID: 'system',
    stickerIDs: ['system0002'],
    key: ';lkmeragdojaebmkae;',
  },
  '傷心': {
    tagID: '傷心',
    ownerID: 'system',
    stickerIDs: ['system0002'],
    key: 'diluvsadjkvae/v;n',
  },
  '加油': {
    tagID: '加油',
    ownerID: 'system',
    stickerIDs: ['system0003', 'system0004'],
    key: ';oiqreiuweq;klfmq',
  },
  '再見': {
    tagID: '再見',
    ownerID: 'system',
    stickerIDs: ['system0003', 'system0005'],
    key: 'l;knzdjvsafmvakls/mf;ilwa',
  },
  '好朋友': {
    tagID: '好朋友',
    ownerID: 'system',
    stickerIDs: ['system0004'],
    key: 'lnj.S<MCVlaeurghoiwefow;np',
  },
};


const db = {
  users,
  stickers,
  tags,
};

export { db as default };
