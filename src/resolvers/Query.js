import AppConfig from '../../const/AppConfig.const';
import TermMatcher from '../../util/TermMatcher.class';
import UserStore from '../class/UserStore/UserStore.class';
import StickerStore from '../class/StickerStore/StickerStore.class';
import TagStore from '../class/TagStore/TagStore.class';


const Query = {
  imgSearch: (parent, { searchTerm }) => {
    const stickerIDs = TermMatcher.match(AppConfig.TERM_LIB.STICKER, searchTerm || '', AppConfig.DEFAULT_IMG_SEARCH_RESP_SIZE);
    console.log(stickerIDs);
    return stickerIDs.map(stickerID => StickerStore.getSticker(stickerID));
  },
  tagSearch: (parent, { searchKey, num }) => {
    const tagIDs = TermMatcher.match(AppConfig.TERM_LIB.TAG, searchKey || '', num || AppConfig.DEFAULT_TAG_SEARCH_RESP_SIZE);
    return tagIDs
      .map(tagID => TagStore.getTag(tagID))
      .map(({ tagID, key, ownerID }) => ({
        tagID,
        key,
        owner: UserStore.getUserInfo(ownerID),
      }));
  },
  ownStickers: (parent, { ownerID }) => {
    const stickerIDs = UserStore.getOwnStickerIDs(ownerID);
    return stickerIDs
      .map(stickerID => StickerStore.getSticker(stickerID))
      .map(({
        stickerID,
        tagIDs,
        description,
        type,
      }) => ({
        stickerID,
        tags: tagIDs.map(tagID => TagStore.getTagInfo(tagID)),
        description,
        type,
      }));
  },
  ownTags: (parent, { ownerID }) => {
    const tagIDs = UserStore.getOwnTagIDs(ownerID);
    return tagIDs.map(tagID => TagStore.getTag(tagID));
  },
};

export { Query as default };
