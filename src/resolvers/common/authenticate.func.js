import ResponseMessage from '../../../const/ResponseMessage.const';
import UserStore from '../../class/UserStore/UserStore.class';


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

export default authenticate;
