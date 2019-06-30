import AppConfig from '../../const/AppConfig.const';
import TermMatcher from '../../util/TermMatcher.class';
import UserStore from '../class/UserStore/UserStore.class';
import StickerStore from '../class/StickerStore/StickerStore.class';
import TagStore from '../class/TagStore/TagStore.class';
import authenticate from './common/authenticate.func';
import ResponseMessage from '../../const/ResponseMessage.const';


const Query = {
  imgSearch: (parent, { arg: { userID, sessionID, searchTerm } }) => {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;

    const searchResult = [];
    const { subscribedTagIDs } = UserStore.getUser(userID);
    subscribedTagIDs.forEach((tagID) => {
      const stickerIDs = TermMatcher.match(`${AppConfig.TERM_LIB.STICKER}_${tagID}`, searchTerm || '', AppConfig.DEFAULT_IMG_SEARCH_RESP_SIZE);
      const stickers = stickerIDs.map(stickerID => StickerStore.getStickerInfo(stickerID));
      searchResult.push({
        tagID,
        tagKey: TagStore.getTag(tagID).key,
        stickers,
      });
    });
    return {
      success: true,
      message: ResponseMessage.IMG_SEARCH.INFO.SUCCESS,
      searchResult,
    };
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
  subscribedTags: (parent, { userID }) => {
    const tagIDs = UserStore.getSubscribedTagIDs(userID);
    return tagIDs.map(tagID => TagStore.getTagInfo(tagID));
  },
};

export default Query;
