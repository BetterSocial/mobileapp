import {
  localCommunityReducer,
  localCommunityState
} from '../../../src/context/reducers/localComunityReducer';

describe('localCommunityReducer test should pass', () => {
  it('default state should be valid', () => {
    expect(localCommunityState).toEqual({
      local_community: ['61573']
    });
  });

  it('should set default state if action type does not match', () => {
    const action = {
      type: 'UNDEFINED',
      payload: ['test1', 'test2']
    };
    expect(localCommunityReducer(localCommunityState, action)).toEqual({
      local_community: ['61573']
    });
  });

  it('should set default state if action type matches', () => {
    const action = {
      type: 'SET_LOCAL_COMUNITY',
      payload: ['test1', 'test2']
    };
    expect(localCommunityReducer(localCommunityState, action)).toEqual({
      local_community: ['test1', 'test2']
    });
  });
});
