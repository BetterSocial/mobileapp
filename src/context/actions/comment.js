import {SET_COMMENT_LIST} from '../Types';

export const saveComment = (payload, dispatch) => {
  dispatch({
    type: SET_COMMENT_LIST,
    payload
  });
};
