import uuid from 'uuid/v4';
import db from '../../../data/db/db.const';
import ResponseMessage from '../../../const/ResponseMessage.const';
import AppConfig from '../../../const/AppConfig.const';

class UserStore {
  constructor() {
    this.users = db.users;
    this.userSessionIDs = {};
  }

  login({ userID, password }) {
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

    const user = this.users[userID];
    if (user === undefined) {
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

    const { name, owntagIDs, subscribedtagIDs } = user;
    const sessionID = uuid();
    this.userSessionIDs[userID] = sessionID;

    return {
      success: true,
      message: ResponseMessage.LOGIN.INFO.SUCCESS,
      name,
      owntagIDs,
      subscribedtagIDs,
      sessionID,
    };
  }

  register({ userID, password, name }) {
    const user = this.users[userID];
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

    if (!AppConfig.FORMAT.PASSWORD.test(userID)) {
      return {
        success: false,
        message: ResponseMessage.REGISTER.ERROR.PASSWORD_RULE_NOT_MATCH,
      };
    }

    this.users[userID] = {
      userID,
      password,
      name,
      owntagIDs: [],
      subscribedtagIDs: [],
    };

    return {
      success: true,
      message: ResponseMessage.REGISTER.INFO.SUCCESS,
    };
  }
}

export default new UserStore();
