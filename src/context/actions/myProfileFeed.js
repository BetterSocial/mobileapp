import {SET_MY_PROFILE_FEED, SET_MY_PROFILE_FEED_BY_INDEX} from '../Types';

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
