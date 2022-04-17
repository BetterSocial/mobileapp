import { RESET_PROFILE_FEEDS, SET_MY_PROFILE_FEED, SET_MY_PROFILE_FEED_BY_INDEX } from '../Types';

const myProfileFeedState = {
  feeds: [],
};

const myProfileFeedReducer = (state = myProfileFeedState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE_FEED:
      return {
        ...state,
        feeds: action.payload,
      };

    case SET_MY_PROFILE_FEED_BY_INDEX:
      const newFeeds = [...state.feeds];
      newFeeds[action.payload.index] = action.payload.singleFeed;

      return {
        ...state,
        feeds: newFeeds,
      };
    case RESET_PROFILE_FEEDS:
      return {
        ...state,
        feeds: [],
      };
    default:
      return state;
  }
};

export { myProfileFeedReducer, myProfileFeedState };
