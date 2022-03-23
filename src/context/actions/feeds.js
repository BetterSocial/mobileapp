import {
  SET_FEED,
  SET_FEED_BY_ID,
  SET_FEED_BY_INDEX,
  SET_FEED_ON_SCREEN_FEED_INDEX,
  SET_FEED_TIMER,
} from '../Types';

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

export const setTimer = (number, dispatch) => {
  dispatch({
    type: SET_FEED_TIMER,
    payload: number,
  });
};

export const setViewPostTimeIndex = (number, dispatch) => {
  dispatch({
    type: SET_FEED_ON_SCREEN_FEED_INDEX,
    payload: number,
  });
};
