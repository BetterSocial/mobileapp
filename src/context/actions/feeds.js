import { SET_FEED, SET_FEED_BY_ID, SET_FEED_BY_INDEX } from '../Types';
export const setMainFeeds = async (data, dispatch) => {
  dispatch({
    type: SET_FEED,
    payload: data,
  });
};
export const setFeedByIndex = (data, dispatch) => {
  dispatch({
    type: SET_FEED_BY_INDEX,
    payload: data,
  });
};
