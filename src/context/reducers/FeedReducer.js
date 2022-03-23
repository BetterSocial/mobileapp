import {
  SET_FEED,
  SET_FEED_BY_ID,
  SET_FEED_BY_INDEX,
  SET_FEED_ON_SCREEN_FEED_INDEX,
  SET_FEED_TIMER,
} from '../Types';

const feedsState = {
  feeds: [],
  timer: 0,
  viewPostTimeIndex: 0,
};
const feedsReducer = (state = feedsState, action) => {
  switch (action.type) {
    case SET_FEED:
      return {
        ...state,
        feeds: action.payload,
      };

    case SET_FEED_BY_INDEX:
      const newFeeds = [...state.feeds];
      newFeeds[action.payload.index] = action.payload.singleFeed;

      return {
        ...state,
        feeds: newFeeds,
      };

    case SET_FEED_TIMER:
      return {
        ...state,
        timer: action.payload,
      };

    case SET_FEED_ON_SCREEN_FEED_INDEX:
      return {
        ...state,
        viewPostTimeIndex: action.payload,
      };

    default:
      return state;
  }
};
export { feedsReducer, feedsState };
