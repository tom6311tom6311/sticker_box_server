import uuid from 'uuid/v4';
import db from '../../../data/db/db.const';

class UserStore {
  constructor() {
    this.users = db.users;
    this.userSessionIDs = {};
  }

  getUser(userID) {
    return this.users[userID] || null;
  }

  getUserInfo(userID) {
    const { name } = this.users[userID] || {};
    return name !== undefined
      ? {
        userID,
        name,
      }
      : null;
  }

  addUser({ userID, password, name }) {
    this.users[userID] = {
      userID,
      password,
      name,
      ownTagIDs: [],
      subscribedTagIDs: [],
    };
  }

  updateUser({ userID, ownTagIDs, subscribedTagIDs }) {
    this.users[userID] = {
      ...this.users[userID],
      ownTagIDs: ownTagIDs || this.users[userID].ownTagIDs,
      subscribedTagIDs: subscribedTagIDs || this.users[userID].subscribedTagIDs,
    };
  }

  giveSession(userID) {
    const sessionID = uuid();
    this.userSessionIDs[userID] = sessionID;
    return sessionID;
  }

  getSessionID(userID) {
    return this.userSessionIDs[userID] || null;
  }

  getOwnStickerIDs(ownerID) {
    return this.users[ownerID].ownStickerIDs || [];
  }

  getOwnTagIDs(ownerID) {
    return this.users[ownerID].ownTagIDs || [];
  }
}

export default new UserStore();
