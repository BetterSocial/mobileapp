import {SET_FEED, SET_FEED_BY_ID} from '../Types';
export const setMainFeeds = async (data, dispatch) => {
  console.log('reducerFeeds');
  console.log(data);
  dispatch({
    type: SET_FEED,
    payload: data,
  });
};
export const setFeedById = (data, dispatch) => {
  dispatch({
    type: SET_FEED_BY_ID,
    payload: data,
  });
};
