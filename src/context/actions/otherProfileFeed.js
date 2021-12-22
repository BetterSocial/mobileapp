import {SET_OTHER_PROFILE_FEED, SET_OTHER_PROFILE_FEED_BY_INDEX} from '../Types';

export const setOtherProfileFeed = (data, dispatch) => {
  dispatch({
    type: SET_OTHER_PROFILE_FEED,
    payload: data,
  });
};

export const setFeedByIndex = (data, dispatch) => {
  dispatch({
    type: SET_OTHER_PROFILE_FEED_BY_INDEX,
    payload: data,
  });
};
