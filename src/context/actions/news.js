import {
  ADD_NEWS_I_FOLLOW,
  NEWS_UPDATE_COMMENT,
  SET_NEWS,
  SET_NEWS_I_FOLLOW,
  SET_NEWS_RESET_ALL
} from '../Types';

export const setNews = (news, dispatch) => {
  dispatch({
    type: SET_NEWS,
    payload: news
  });
};
export const setIFollow = (ifollow, dispatch) => {
  dispatch({
    type: SET_NEWS_I_FOLLOW,
    payload: ifollow
  });
};
export const addIFollowByID = (ifollow, dispatch) => {
  dispatch({
    type: ADD_NEWS_I_FOLLOW,
    payload: ifollow
  });
};

export const updateComment = (comment, activityId, dispatch) => {
  dispatch({
    type: NEWS_UPDATE_COMMENT,
    payload: {
      comment,
      activityId
    }
  });
};

export const resetAllNews = (dispatch) => {
  dispatch({
    type: SET_NEWS_RESET_ALL
  });
};
