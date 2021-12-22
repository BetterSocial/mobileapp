import {SET_OTHER_PROFILE_FEED, SET_OTHER_PROFILE_FEED_BY_INDEX} from '../Types';

const otherProfileFeedState = {
  feeds: [],
};

const otherProfileFeedReducer = (state = otherProfileFeedState, action) => {
  switch (action.type) {
    case SET_OTHER_PROFILE_FEED:
      return {
        ...state,
        feeds: action.payload,
      };

    case SET_OTHER_PROFILE_FEED_BY_INDEX:
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

export {otherProfileFeedReducer, otherProfileFeedState};
