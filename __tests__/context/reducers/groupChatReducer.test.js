import {groupChatReducer, groupChatState} from '../../../src/context/reducers/groupChat';

describe('groupChatReducer test should pass', () => {
  it('default state should be valid', () => {
    expect(groupChatState).toEqual({
      asset: [],
      participants: []
    });
  });

  it('should set default state if action type does not match', () => {
    const action = {
      type: 'UNDEFINED',
      payload: ['test1', 'test2']
    };
    expect(groupChatReducer(groupChatState, action)).toEqual(groupChatState);
  });

  it('should set asset group chat state if action type matches', () => {
    const action = {
      type: 'SET_ASSET_GROUP_CHAT',
      payload: ['test1', 'test2']
    };
    expect(groupChatReducer(groupChatState, action)).toEqual({
      asset: ['test1', 'test2'],
      participants: []
    });
  });

  it('should set participant group chat state if action type matches', () => {
    const action = {
      type: 'SET_PARTICIPANTS_GROUP_CHAT',
      payload: [
        {
          id: 1,
          name: 'group chat'
        }
      ]
    };
    expect(groupChatReducer(groupChatState, action)).toEqual({
      asset: [],
      participants: action.payload
    });
  });
});
