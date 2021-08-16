import {SET_FEED, SET_FEED_BY_ID} from '../Types';

const feedsState = {
  feeds: [],
};
const feedsReducer = (state = feedsState, action) => {
  switch (action.type) {
    case SET_FEED:
      return {
        ...state,
        feeds: action.payload,
      };

    case SET_FEED_BY_ID:
      let newFeeds = [...state.feeds];
      newFeeds[action.payload.index] = action.payload.singleFeed;

      return {
        ...state,
        feeds: newFeeds,
      };
    default:
      return state;
  }
};
export {feedsReducer, feedsState};
