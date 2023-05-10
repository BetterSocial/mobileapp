import {topicsReducer, topicsState} from '../../../src/context/reducers/topicsReducer';

describe('topicsReducer test should pass', () => {
  it('return default topics state', () => {
    expect(topicsState).toEqual({
      topics: []
    });
  });

  it('return set topics if action type is matched', () => {
    const action = {
      type: 'SET_TOPICS',
      payload: [
        {
          id: 1,
          name: 'test'
        }
      ]
    };
    expect(topicsReducer(topicsState, action)).toEqual({
      topics: [
        {
          id: 1,
          name: 'test'
        }
      ]
    });
  });

  it('return default topics if action type is not matched', () => {
    const action = {
      type: 'UNDEFINED',
      payload: [
        {
          id: 1,
          name: 'test'
        }
      ]
    };

    expect(topicsReducer(topicsState, action)).toEqual({
      topics: []
    });
  });
});
