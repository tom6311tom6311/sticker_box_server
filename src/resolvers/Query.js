import AppConfig from '../../const/AppConfig.const';
import TermMatcher from '../../util/TermMatcher.class';


const Query = {
  imgSearch: (parent, { searchTerm }, { db }) => {
    const stickerIDs = TermMatcher.match(searchTerm || '', AppConfig.DEFAULT_IMG_LIST_SIZE);
    return stickerIDs.map(stickerID => db.stickers[stickerID]);
  },
};

export { Query as default };
