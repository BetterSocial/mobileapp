import {
  RESET_PROFILE_FEEDS,
  SET_MY_PROFILE_ANON_FEED,
  SET_MY_PROFILE_ANON_FEED_BY_INDEX,
  SET_MY_PROFILE_FEED,
  SET_MY_PROFILE_FEED_BY_INDEX
} from '../../../src/context/Types';
import {
  myProfileFeedReducer,
  myProfileFeedState
} from '../../../src/context/reducers/myProfileFeedReducer';

describe('myProfileFeedReducer', () => {
  it('should set my profile feed', () => {
    const payload = ['feed1', 'feed2'];
    const action = {type: SET_MY_PROFILE_FEED, payload};
    const expectedState = {...myProfileFeedState, feeds: payload};

    const newState = myProfileFeedReducer(myProfileFeedState, action);

    expect(newState).toEqual(expectedState);
  });

  it('should set my profile anonymous feed', () => {
    const payload = ['feed1', 'feed2'];
    const action = {type: SET_MY_PROFILE_ANON_FEED, payload};
    const expectedState = {...myProfileFeedState, anonymousFeeds: payload};

    const newState = myProfileFeedReducer(myProfileFeedState, action);

    expect(newState).toEqual(expectedState);
  });

  it('should set my profile feed by index', () => {
    const index = 1;
    const singleFeed = 'feed2';
    const action = {type: SET_MY_PROFILE_FEED_BY_INDEX, payload: {index, singleFeed}};
    const expectedState = {...myProfileFeedState, feeds: ['', singleFeed]};

    const newState = myProfileFeedReducer({...myProfileFeedState, feeds: ['', '']}, action);

    expect(newState).toEqual(expectedState);
  });

  it('should set my profile anonymous feed by index', () => {
    const index = 1;
    const singleFeed = 'feed2';
    const action = {type: SET_MY_PROFILE_ANON_FEED_BY_INDEX, payload: {index, singleFeed}};
    const expectedState = {...myProfileFeedState, anonymousFeeds: ['', singleFeed]};

    const newState = myProfileFeedReducer(
      {...myProfileFeedState, anonymousFeeds: ['', '']},
      action
    );

    expect(newState).toEqual(expectedState);
  });

  it('should reset my profile feeds', () => {
    const initialState = {feeds: ['feed1'], anonymousFeeds: ['feed2']};
    const action = {type: RESET_PROFILE_FEEDS};
    const expectedState = {feeds: [], anonymousFeeds: []};

    const newState = myProfileFeedReducer(initialState, action);

    expect(newState).toEqual(expectedState);
  });

  it('should return the current state for an unknown action type', () => {
    const action = {type: 'UNKNOWN_ACTION'};

    const newState = myProfileFeedReducer(myProfileFeedState, action);

    expect(newState).toEqual(myProfileFeedState);
  });
});
