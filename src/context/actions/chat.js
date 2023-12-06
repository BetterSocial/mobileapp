import {SET_REPLY_TARGET} from '../Types';

export const setReplyTarget = (payload, dispatch) => {
  dispatch({
    type: SET_REPLY_TARGET,
    payload
  });
};
