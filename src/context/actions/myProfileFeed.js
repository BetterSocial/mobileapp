import { RESET_PROFILE_FEEDS, SET_MY_PROFILE_FEED, SET_MY_PROFILE_FEED_BY_INDEX } from '../Types';

export const setMyProfileFeed = (data, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE_FEED,
    payload: data,
  });
};

export const setFeedByIndex = (data, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE_FEED_BY_INDEX,
    payload: data,
  });
};

export const resetProfileFeed = (dispatch) => {
  dispatch({
    type: RESET_PROFILE_FEEDS,
  });
};
