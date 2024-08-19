/* eslint-disable no-case-declarations */
import {
  SET_FEED,
  SET_FEED_BY_INDEX,
  SET_FEED_ON_SCREEN_FEED_INDEX,
  SET_FEED_ON_TOPIC_SCREEN_FEED_INDEX,
  SET_FEED_TIMER,
  SET_TOPIC_FEED,
  SET_TOPIC_FEED_BY_INDEX
} from '../Types';

const feedsState = {
  feeds: [],
  topicFeeds: [],
  timer: new Date(),
  viewPostTimeIndex: 0,
  topicViewPostTimeIndex: 0
};
const feedsReducer = (state = feedsState, action) => {
  switch (action.type) {
    case SET_FEED:
      return {
        ...state,
        feeds: action.payload
      };

    case SET_FEED_BY_INDEX:
      const newFeeds = [...state.feeds];
      newFeeds[action.payload.index] = action.payload.singleFeed;

      return {
        ...state,
        feeds: newFeeds
      };

    case SET_TOPIC_FEED:
      return {
        ...state,
        topicFeeds: action.payload
      };

    case SET_TOPIC_FEED_BY_INDEX:
      const newTopicFeeds = [...state.topicFeeds];
      newTopicFeeds[action.payload.index] = action.payload.singleFeed;
      return {
        ...state,
        topicFeeds: newTopicFeeds
      };

    case SET_FEED_TIMER:
      return {
        ...state,
        timer: action.payload
      };

    case SET_FEED_ON_SCREEN_FEED_INDEX:
      return {
        ...state,
        viewPostTimeIndex: action.payload
      };

    case SET_FEED_ON_TOPIC_SCREEN_FEED_INDEX:
      return {
        ...state,
        topicViewPostTimeIndex: action.payload
      };

    default:
      return state;
  }
};
export {feedsReducer, feedsState};
