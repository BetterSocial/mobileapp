import {SET_CHANNEL, SET_PROFILE_CHANNEL} from '../../../src/context/Types';
import {channelReducer} from '../../../src/context/reducers/channelReducer';

describe('channelReducer', () => {
  it('should handle SET_CHANNEL', () => {
    const prevState = {
      channel: null,
      profileChannel: null
    };
    const action = {
      type: SET_CHANNEL,
      payload: 'new channel'
    };
    const expectedState = {
      channel: 'new channel',
      profileChannel: null
    };

    expect(channelReducer(prevState, action)).toEqual(expectedState);
  });

  it('should handle SET_PROFILE_CHANNEL', () => {
    const prevState = {
      channel: null,
      profileChannel: null
    };
    const action = {
      type: SET_PROFILE_CHANNEL,
      payload: 'new profile channel'
    };
    const expectedState = {
      channel: null,
      profileChannel: 'new profile channel'
    };

    expect(channelReducer(prevState, action)).toEqual(expectedState);
  });

  it('should return the current state when the action type is unknown', () => {
    const prevState = {
      channel: 'channel',
      profileChannel: 'profile channel'
    };
    const action = {
      type: 'UNKNOWN_ACTION'
    };

    expect(channelReducer(prevState, action)).toEqual(prevState);
  });
});
