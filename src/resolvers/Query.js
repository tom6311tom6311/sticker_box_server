import AppConfig from '../../const/AppConfig.const';
import TermMatcher from '../../util/TermMatcher.class';
import UserStore from '../class/UserStore/UserStore.class';
import StickerStore from '../class/StickerStore/StickerStore.class';


const Query = {
  imgSearch: (parent, { searchTerm }) => {
    const stickerIDs = TermMatcher.match(searchTerm || '', AppConfig.DEFAULT_IMG_LIST_SIZE);
    return stickerIDs.map(stickerID => StickerStore.getSticker(stickerID));
  },
  ownStickers: (parent, { ownerID }) => {
    const stickerIDs = UserStore.getOwnStickerIDs(ownerID);
    return stickerIDs.map(stickerID => StickerStore.getSticker(stickerID));
  },
};

export { Query as default };
