import {ADD_NEWS_I_FOLLOW, SET_NEWS, SET_NEWS_I_FOLLOW} from '../Types';

export const setNews = (news, dispatch) => {
  dispatch({
    type: SET_NEWS,
    payload: news,
  });
};
export const setIFollow = (ifollow, dispatch) => {
  dispatch({
    type: SET_NEWS_I_FOLLOW,
    payload: ifollow,
  });
};
export const addIFollowByID = (ifollow, dispatch) => {
  dispatch({
    type: ADD_NEWS_I_FOLLOW,
    payload: ifollow,
  });
};
