import fs from 'fs';
import AppConfig from '../../const/AppConfig.const';
import ResponseMessage from '../../const/ResponseMessage.const';
import UserStore from '../class/UserStore/UserStore.class';
import StickerStore from '../class/StickerStore/StickerStore.class';
import TagStore from '../class/TagStore/TagStore.class';
import TermMatcher from '../../util/TermMatcher.class';
import authenticate from './common/authenticate.func';

const Mutation = {
  login(parent, { arg: { userID, password } }) {
    if (!userID) {
      return {
        success: false,
        message: ResponseMessage.LOGIN.ERROR.USER_ID_EMPTY,
      };
    }

    if (!password) {
      return {
        success: false,
        message: ResponseMessage.LOGIN.ERROR.PASSWORD_EMPTY,
      };
    }

    const user = UserStore.getUser(userID);
    if (user === null) {
      return {
        success: false,
        message: ResponseMessage.LOGIN.ERROR.USER_NOT_EXISTS,
      };
    }

    if (user.password !== password) {
      return {
        success: false,
        message: ResponseMessage.LOGIN.ERROR.PASSWORD_WRONG,
      };
    }

    const { name, ownTagIDs, subscribedTagIDs } = user;
    const sessionID = UserStore.giveSession(userID);

    return {
      success: true,
      message: ResponseMessage.LOGIN.INFO.SUCCESS,
      userID,
      name,
      ownTagIDs,
      subscribedTagIDs,
      sessionID,
    };
  },
  register(parent, { arg: { userID, password, name } }) {
    const user = UserStore.getUser(userID);
    if (user !== null) {
      return {
        success: false,
        message: ResponseMessage.REGISTER.ERROR.USER_ID_EXISTED,
      };
    }

    if (!AppConfig.FORMAT.USER_ID.test(userID)) {
      return {
        success: false,
        message: ResponseMessage.REGISTER.ERROR.USER_ID_RULE_NOT_MATCH,
      };
    }

    if (!AppConfig.FORMAT.PASSWORD.test(password)) {
      return {
        success: false,
        message: ResponseMessage.REGISTER.ERROR.PASSWORD_RULE_NOT_MATCH,
      };
    }

    UserStore.addUser({ userID, password, name });

    const { ownTagIDs, subscribedTagIDs } = UserStore.getUser(userID);
    const sessionID = UserStore.giveSession(userID);

    return {
      success: true,
      message: ResponseMessage.REGISTER.INFO.SUCCESS,
      userID,
      name,
      ownTagIDs,
      subscribedTagIDs,
      sessionID,
    };
  },
  createTag(
    parent,
    {
      arg: {
        userID,
        sessionID,
        tagID,
        key,
      },
    },
  ) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!tagID) {
      return {
        success: false,
        message: ResponseMessage.CREATE_TAG.ERROR.TAG_ID_EMPTY,
      };
    }
    if (!key) {
      return {
        success: false,
        message: ResponseMessage.CREATE_TAG.ERROR.KEY_EMPTY,
      };
    }
    if (!AppConfig.FORMAT.UUID.test(tagID)) {
      return {
        success: false,
        message: ResponseMessage.CREATE_TAG.ERROR.WRONG_TAG_ID_FORMAT,
      };
    }
    if (!AppConfig.FORMAT.CHINESE_ONLY.test(key)) {
      return {
        success: false,
        message: ResponseMessage.CREATE_TAG.ERROR.KEY_SHOULD_BE_CHINESE,
      };
    }
    const user = UserStore.getUser(userID);
    UserStore.updateUser({
      userID,
      ownTagIDs: [...user.ownTagIDs, tagID],
    });
    TagStore.addTag({
      tagID,
      ownerID: userID,
      key,
    });
    return {
      success: true,
      message: ResponseMessage.CREATE_TAG.INFO.SUCCESS,
    };
  },
  subscribeTag(parent, { arg: { userID, sessionID, tagID } }) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!tagID) {
      return {
        success: false,
        message: ResponseMessage.SUBSCRIBE_TAG.ERROR.TAG_ID_EMPTY,
      };
    }
    const tag = TagStore.getTag(tagID);
    if (tag === null) {
      return {
        success: false,
        message: ResponseMessage.SUBSCRIBE_TAG.ERROR.TAG_NOT_EXIST,
      };
    }
    const user = UserStore.getUser(userID);
    UserStore.updateUser({
      userID,
      subscribedTagIDs: [...user.subscribedTagIDs, tagID],
    });
    TagStore.updateTag({
      tagID,
      subscriberIDs: [...tag.subscriberIDs, userID],
    });
    return {
      success: true,
      message: ResponseMessage.CREATE_TAG.INFO.SUCCESS,
    };
  },
  cancelSubscribeTag(parent, { arg: { userID, sessionID, tagID } }) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!tagID) {
      return {
        success: false,
        message: ResponseMessage.CANCEL_SUBSCRIBE_TAG.ERROR.TAG_ID_EMPTY,
      };
    }
    const tag = TagStore.getTag(tagID);
    if (tag === null) {
      return {
        success: false,
        message: ResponseMessage.CANCEL_SUBSCRIBE_TAG.ERROR.TAG_NOT_EXIST,
      };
    }
    const user = UserStore.getUser(userID);
    UserStore.updateUser({
      userID,
      subscribedTagIDs: user.subscribedTagIDs.filter((tid) => tid !== tagID),
    });
    TagStore.updateTag({
      tagID,
      subscriberIDs: tag.subscriberIDs.filter((sid) => sid !== userID),
    });
    return {
      success: true,
      message: ResponseMessage.CANCEL_SUBSCRIBE_TAG.INFO.SUCCESS,
    };
  },
  kickSubscribers(
    parent,
    {
      arg: {
        userID,
        sessionID,
        tagID,
        kickUserIDs,
      },
    },
  ) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!tagID) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBERS.ERROR.TAG_ID_EMPTY,
      };
    }
    if (!kickUserIDs || kickUserIDs.length === 0) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBERS.ERROR.KICK_USER_ID_EMPTY,
      };
    }
    const tag = TagStore.getTag(tagID);
    if (tag === null) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBERS.ERROR.TAG_NOT_EXIST,
      };
    }
    if (tag.ownerID !== userID) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBERS.ERROR.TAG_NOT_YOUR_OWN,
      };
    }
    kickUserIDs.forEach((kickUserID) => {
      const kickUser = UserStore.getUser(kickUserID);
      if (kickUser === null) {
        return;
      }
      UserStore.updateUser({
        userID: kickUserID,
        subscribedTagIDs: kickUser.subscribedTagIDs.filter((tid) => tid !== tagID),
      });
    });
    TagStore.updateTag({
      tagID,
      subscriberIDs: tag.subscriberIDs.filter((sid) => kickUserIDs.indexOf(sid) === -1),
    });
    console.log(TagStore.getTag(tagID));
    return {
      success: true,
      message: ResponseMessage.KICK_SUBSCRIBERS.INFO.SUCCESS,
    };
  },
  deleteTag(parent, { arg: { userID, sessionID, tagID } }) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!tagID) {
      return {
        success: false,
        message: ResponseMessage.DELETE_TAG.ERROR.TAG_ID_EMPTY,
      };
    }
    const tag = TagStore.getTag(tagID);
    if (tag === null) {
      return {
        success: false,
        message: ResponseMessage.DELETE_TAG.ERROR.TAG_NOT_EXIST,
      };
    }
    if (tag.ownerID !== userID) {
      return {
        success: false,
        message: ResponseMessage.DELETE_TAG.ERROR.TAG_NOT_YOUR_OWN,
      };
    }
    const user = UserStore.getUser(userID);
    tag.subscriberIDs.forEach((subscriberID) => {
      UserStore.updateUser({
        userID: subscriberID,
        subscribedTagIDs: user.subscribedTagIDs.filter((tid) => tid !== tagID),
      });
    });
    TermMatcher.deleteTerm(AppConfig.TERM_LIB.TAG, tagID);
    TagStore.deleteTag(tagID);
    return {
      success: true,
      message: ResponseMessage.DELETE_TAG.INFO.SUCCESS,
    };
  },
  uploadSticker(
    parent,
    {
      arg: {
        userID,
        sessionID,
        stickerID,
        description,
        type,
      },
    },
  ) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!stickerID) {
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.STICKER_ID_EMPTY,
      };
    }
    if (!description) {
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.DESCRIPTION_EMPTY,
      };
    }
    if (!type) {
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.TYPE_EMPTY,
      };
    }
    const imgPath = `${AppConfig.IMG_DIR}${stickerID}.${type}`;
    if (!fs.existsSync(imgPath)) {
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.FILE_NOT_EXIST,
      };
    }
    if (AppConfig.ALLOWED_FORMAT.indexOf(type) === -1) {
      fs.unlinkSync(imgPath);
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.WRONG_IMAGE_FORMAT,
      };
    }
    if (!AppConfig.FORMAT.UUID.test(stickerID)) {
      fs.unlinkSync(imgPath);
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.WRONG_STICKER_ID_FORMAT,
      };
    }
    if (!AppConfig.FORMAT.CHINESE_ONLY.test(description)) {
      fs.unlinkSync(imgPath);
      return {
        success: false,
        message: ResponseMessage.UPLOAD_STICKER.ERROR.DESC_SHOULD_BE_CHINESE,
      };
    }
    StickerStore.addSticker({
      stickerID,
      ownerID: userID,
      description,
      type,
    });
    const user = UserStore.getUser(userID);
    UserStore.updateUser({
      userID,
      ownStickerIDs: [...user.ownStickerIDs, stickerID],
    });
    TermMatcher.updateTerms(AppConfig.TERM_LIB.STICKER, [{ id: stickerID, term: description }]);
    return {
      success: true,
      message: ResponseMessage.UPLOAD_STICKER.INFO.SUCCESS,
    };
  },
  updateSticker(
    parent,
    {
      arg: {
        userID,
        sessionID,
        stickerID,
        description,
        tagIDs,
      },
    },
  ) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!stickerID) {
      return {
        success: false,
        message: ResponseMessage.UPDATE_STICKER.ERROR.STICKER_ID_EMPTY,
      };
    }
    const sticker = StickerStore.getSticker(stickerID);
    if (sticker === null) {
      return {
        success: false,
        message: ResponseMessage.UPDATE_STICKER.ERROR.STICKER_NOT_EXIST,
      };
    }
    if (sticker.ownerID !== userID) {
      return {
        success: false,
        message: ResponseMessage.UPDATE_STICKER.ERROR.STICKER_NOT_YOUR_OWN,
      };
    }
    if (description && !AppConfig.FORMAT.CHINESE_ONLY.test(description)) {
      return {
        success: false,
        message: ResponseMessage.UPDATE_STICKER.ERROR.DESC_SHOULD_BE_CHINESE,
      };
    }
    if (description) {
      StickerStore.updateSticker({
        stickerID,
        description,
      });
      sticker.tagIDs.forEach((tagID) => {
        TermMatcher.deleteTerm(`${AppConfig.TERM_LIB.STICKER}_${tagID}`, stickerID);
        TermMatcher.updateTerms(`${AppConfig.TERM_LIB.STICKER}_${tagID}`, [{ id: stickerID, term: description }]);
      });
    }
    if (tagIDs && tagIDs.some((tagID) => TagStore.getTag(tagID) === null)) {
      return {
        success: false,
        message: ResponseMessage.UPDATE_STICKER.ERROR.SOME_TAGS_NOT_EXIST,
      };
    }
    if (
      tagIDs
      && tagIDs.some((tagID) => TagStore.getTag(tagID).subscriberIDs.indexOf(userID) === -1)
    ) {
      return {
        success: false,
        message: ResponseMessage.UPDATE_STICKER.ERROR.SOME_TAGS_NOT_SUBSCRIBED,
      };
    }
    if (tagIDs) {
      StickerStore.updateSticker({
        stickerID,
        tagIDs: [...new Set([...sticker.tagIDs, ...tagIDs])],
      });
      tagIDs.forEach((tagID) => {
        const tag = TagStore.getTag(tagID);
        if (tag.stickerIDs.indexOf(stickerID) !== -1) return;
        TagStore.updateTag({
          tagID,
          stickerIDs: [...tag.stickerIDs, stickerID],
        });
      });
    }
    return {
      success: true,
      message: ResponseMessage.UPDATE_STICKER.INFO.SUCCESS,
    };
  },
  deleteSticker(parent, { arg: { userID, sessionID, stickerID } }) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!stickerID) {
      return {
        success: false,
        message: ResponseMessage.DELETE_STICKER.ERROR.STICKER_ID_EMPTY,
      };
    }
    const sticker = StickerStore.getSticker(stickerID);
    if (sticker === null) {
      return {
        success: false,
        message: ResponseMessage.DELETE_STICKER.ERROR.STICKER_NOT_EXIST,
      };
    }
    if (sticker.ownerID !== userID) {
      return {
        success: false,
        message: ResponseMessage.DELETE_STICKER.ERROR.STICKER_NOT_YOUR_OWN,
      };
    }
    sticker.tagIDs.forEach((tagID) => {
      const tag = TagStore.getTag(tagID);
      TagStore.updateTag({
        tagID,
        stickerIDs: tag.stickerIDs.filter((sid) => sid !== stickerID),
      });
      TermMatcher.deleteTerm(`${AppConfig.TERM_LIB.STICKER}_${tagID}`, stickerID);
    });
    const user = UserStore.getUser(userID);
    UserStore.updateUser({
      userID,
      ownStickerIDs: user.ownStickerIDs.filter((sid) => sid !== stickerID),
    });
    StickerStore.deleteSticker(stickerID);
    return {
      success: true,
      message: ResponseMessage.DELETE_STICKER.INFO.SUCCESS,
    };
  },
};

export default Mutation;
