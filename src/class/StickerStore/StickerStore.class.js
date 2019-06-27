import db from '../../../data/db/db.const';

class StickerStore {
  constructor() {
    this.stickers = db.stickers;
  }

  getSticker(stickerID) {
    return this.stickers[stickerID] || {};
  }
}

export default new StickerStore();
