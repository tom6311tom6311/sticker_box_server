import AppConfig from '../../const/AppConfig.const';
import ResponseMessage from '../../const/ResponseMessage.const';
import UserStore from '../class/UserStore/UserStore.class';
import StickerStore from '../class/StickerStore/StickerStore.class';
import TagStore from '../class/TagStore/TagStore.class';

const authenticate = ({ userID, sessionID }) => {
  if (!userID) {
    return {
      success: false,
      message: ResponseMessage.AUTH.ERROR.USER_ID_EMPTY,
    };
  }
  if (!sessionID) {
    return {
      success: false,
      message: ResponseMessage.AUTH.ERROR.SESSION_ID_EMPTY,
    };
  }
  const user = UserStore.getUser(userID);
  if (user === null) {
    return {
      success: false,
      message: ResponseMessage.AUTH.ERROR.USER_NOT_EXIST,
    };
  }
  const validateSessionID = UserStore.getSessionID(userID);
  if (validateSessionID === null) {
    return {
      success: false,
      message: ResponseMessage.AUTH.ERROR.SESSION_NOT_EXIST,
    };
  }
  if (sessionID !== validateSessionID) {
    return {
      success: false,
      message: ResponseMessage.AUTH.ERROR.SESSION_VERIFICATION_FAILED,
    };
  }
  return {
    success: true,
    message: ResponseMessage.AUTH.INFO.SUCCESS,
  };
};


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
      name,
      ownTagIDs,
      subscribedTagIDs,
      sessionID,
    };
  },
  register(parent, { arg: { userID, password, name } }) {
    const user = UserStore.getUser(userID);
    if (user !== undefined) {
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

    return {
      success: true,
      message: ResponseMessage.REGISTER.INFO.SUCCESS,
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
      subscribedTagIDs: user.subscribedTagIDs.filter(tid => tid !== tagID),
    });
    TagStore.updateTag({
      tagID,
      subscriberIDs: tag.subscriberIDs.filter(sid => sid !== userID),
    });
    return {
      success: true,
      message: ResponseMessage.CANCEL_SUBSCRIBE_TAG.INFO.SUCCESS,
    };
  },
  kickSubscribeTag(
    parent,
    {
      arg: {
        userID,
        sessionID,
        tagID,
        kickUserID,
      },
    },
  ) {
    const authResponse = authenticate({ userID, sessionID });
    if (authResponse.success !== true) return authResponse;
    if (!tagID) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBE_TAG.ERROR.TAG_ID_EMPTY,
      };
    }
    if (!kickUserID) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBE_TAG.ERROR.KICK_USER_ID_EMPTY,
      };
    }
    const tag = TagStore.getTag(tagID);
    if (tag === null) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBE_TAG.ERROR.TAG_NOT_EXIST,
      };
    }
    if (tag.ownerID !== userID) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBE_TAG.ERROR.TAG_NOT_YOUR_OWN,
      };
    }
    const kickUserInfo = UserStore.getUserInfo(kickUserID);
    if (kickUserInfo === null) {
      return {
        success: false,
        message: ResponseMessage.KICK_SUBSCRIBE_TAG.ERROR.KICK_USER_NOT_EXIST,
      };
    }
    const user = UserStore.getUser(userID);
    UserStore.updateUser({
      kickUserID,
      subscribedTagIDs: user.subscribedTagIDs.filter(tid => tid !== tagID),
    });
    TagStore.updateTag({
      tagID,
      subscriberIDs: tag.subscriberIDs.filter(sid => sid !== kickUserID),
    });
    return {
      success: true,
      message: ResponseMessage.KICK_SUBSCRIBE_TAG.INFO.SUCCESS,
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
        subscriberID,
        subscribedTagIDs: user.subscribedTagIDs.filter(tid => tid !== tagID),
      });
    });
    TagStore.deleteTag(tagID);
    return {
      success: true,
      message: ResponseMessage.DELETE_TAG.INFO.SUCCESS,
    };
  },
  // uploadSticker(
  //   parent,
  //   {
  //     arg: {
  //       userID,
  //       sessionID,
  //       stickerID,
  //       description,
  //       type,
  //     },
  //   },
  // ) {
  // },
  // updateSticker(parent, { arg }) {
  // },
  // deleteSticker(parent, { arg }) {
  // },
};

export { Mutation as default };
