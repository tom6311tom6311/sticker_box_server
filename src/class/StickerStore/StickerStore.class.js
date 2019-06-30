import db from '../../../data/db/db.const';

class StickerStore {
  constructor() {
    this.stickers = db.stickers;
  }

  getSticker(stickerID) {
    return this.stickers[stickerID] || {};
  }

  getStickerInfo(stickerID) {
    const { ownerID, description, type } = this.stickers[stickerID] || {};
    return ownerID !== undefined
      ? {
        stickerID,
        ownerID,
        description,
        type,
      }
      : null;
  }

  addSticker({
    stickerID,
    ownerID,
    description,
    type,
  }) {
    this.stickers[stickerID] = {
      stickerID,
      ownerID,
      tagIDs: [],
      description,
      type,
    };
  }

  updateSticker({ stickerID, tagIDs, description }) {
    this.stickers[stickerID] = {
      ...this.stickers[stickerID],
      tagIDs: tagIDs || this.stickers[stickerID].tagIDs,
      description: description || this.stickers[stickerID].description,
    };
  }

  deleteSticker(stickerID) {
    delete this.stickers[stickerID];
  }
}

export default new StickerStore();
