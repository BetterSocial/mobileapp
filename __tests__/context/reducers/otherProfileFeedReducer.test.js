import {SET_OTHER_PROFILE_FEED, SET_OTHER_PROFILE_FEED_BY_INDEX} from '../../../src/context/Types';
import {
  otherProfileFeedReducer,
  otherProfileFeedState
} from '../../../src/context/reducers/OtherProfileFeedReducer';

describe('otherProfileFeedReducer', () => {
  it('should return the initial state', () => {
    expect(otherProfileFeedReducer(undefined, {})).toEqual(otherProfileFeedState);
  });

  it('should handle SET_OTHER_PROFILE_FEED', () => {
    const payload = [
      {id: 1, text: 'First post'},
      {id: 2, text: 'Second post'}
    ];
    const action = {type: SET_OTHER_PROFILE_FEED, payload};
    const expectedState = {...otherProfileFeedState, feeds: payload};

    expect(otherProfileFeedReducer(otherProfileFeedState, action)).toEqual(expectedState);
  });

  it('should handle SET_OTHER_PROFILE_FEED_BY_INDEX', () => {
    const index = 1;
    const singleFeed = {id: 2, text: 'Modified post'};
    const action = {type: SET_OTHER_PROFILE_FEED_BY_INDEX, payload: {index, singleFeed}};
    const expectedState = {
      ...otherProfileFeedState,
      feeds: [
        {id: 1, text: 'First post'},
        {id: 2, text: 'Modified post'}
      ]
    };

    expect(
      otherProfileFeedReducer(
        {
          ...otherProfileFeedState,
          feeds: [
            {id: 1, text: 'First post'},
            {id: 2, text: 'Second post'}
          ]
        },
        action
      )
    ).toEqual(expectedState);
  });
});
