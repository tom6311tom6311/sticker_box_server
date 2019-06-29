import db from '../../../data/db/db.const';

class TagStore {
  constructor() {
    this.tags = db.tags;
  }

  getTag(tagID) {
    return this.tags[tagID] || null;
  }

  getTagInfo(tagID) {
    const { ownerID, key } = this.tags[tagID] || {};
    return ownerID !== undefined
      ? {
        tagID,
        ownerID,
        key,
      }
      : null;
  }

  addTag({ tagID, ownerID, key }) {
    this.tags[tagID] = {
      tagID,
      ownerID,
      stickerIDs: [],
      key,
    };
  }

  updateTag({ tagID, stickerIDs, subscriberIDs }) {
    this.tags[tagID] = {
      ...this.tags[tagID],
      stickerIDs: stickerIDs || this.tags[tagID].stickerIDs,
      subscriberIDs: subscriberIDs || this.tags[tagID].subscriberIDs,
    };
  }

  deleteTag(tagID) {
    delete this.tags[tagID];
  }
}

export default new TagStore();
