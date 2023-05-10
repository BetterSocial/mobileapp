import {
  SET_FEED,
  SET_FEED_BY_INDEX,
  SET_FEED_ON_SCREEN_FEED_INDEX,
  SET_FEED_TIMER,
  SET_TOPIC_FEED,
  SET_TOPIC_FEED_BY_INDEX
} from '../../../src/context/Types';
import {feedsReducer, feedsState} from '../../../src/context/reducers/FeedReducer';

describe('feedsReducer', () => {
  it('should return the initial state', () => {
    expect(feedsReducer(undefined, {})).toEqual(feedsState);
  });

  it('should handle SET_FEED', () => {
    const feeds = [
      {id: 1, title: 'Test Feed 1'},
      {id: 2, title: 'Test Feed 2'}
    ];
    const action = {type: SET_FEED, payload: feeds};
    const expectedState = {...feedsState, feeds};
    expect(feedsReducer(feedsState, action)).toEqual(expectedState);
  });

  it('should handle SET_FEED_BY_INDEX', () => {
    const index = 1;
    const singleFeed = {id: 2, title: 'Test Feed 2 Updated'};
    const action = {type: SET_FEED_BY_INDEX, payload: {index, singleFeed}};
    const expectedState = {...feedsState, feeds: [undefined, singleFeed]};
    expect(feedsReducer(feedsState, action)).toEqual(expectedState);
  });

  it('should handle SET_TOPIC_FEED', () => {
    const topicFeeds = [
      {id: 1, title: 'Test Topic Feed 1'},
      {id: 2, title: 'Test Topic Feed 2'}
    ];
    const action = {type: SET_TOPIC_FEED, payload: topicFeeds};
    const expectedState = {...feedsState, topicFeeds};
    expect(feedsReducer(feedsState, action)).toEqual(expectedState);
  });

  it('should handle SET_TOPIC_FEED_BY_INDEX', () => {
    const index = 1;
    const singleFeed = {id: 2, title: 'Test Topic Feed 2 Updated'};
    const action = {type: SET_TOPIC_FEED_BY_INDEX, payload: {index, singleFeed}};
    const expectedState = {...feedsState, topicFeeds: [undefined, singleFeed]};
    expect(feedsReducer(feedsState, action)).toEqual(expectedState);
  });

  it('should handle SET_FEED_TIMER', () => {
    const timer = new Date();
    const action = {type: SET_FEED_TIMER, payload: timer};
    const expectedState = {...feedsState, timer};
    expect(feedsReducer(feedsState, action)).toEqual(expectedState);
  });

  it('should handle SET_FEED_ON_SCREEN_FEED_INDEX', () => {
    const viewPostTimeIndex = 5;
    const action = {type: SET_FEED_ON_SCREEN_FEED_INDEX, payload: viewPostTimeIndex};
    const expectedState = {...feedsState, viewPostTimeIndex};
    expect(feedsReducer(feedsState, action)).toEqual(expectedState);
  });
});
