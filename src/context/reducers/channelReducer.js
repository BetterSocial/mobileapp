import {SET_CHANNEL, SET_PROFILE_CHANNEL} from '../Types';

const channelState = {
  channel: null,
  profileChannel: null,
};
const channelReducer = (state = channelState, action) => {
  switch (action.type) {
    case SET_CHANNEL:
      return {
        ...state,
        channel: action.payload,
      };
    case SET_PROFILE_CHANNEL:
      return {
        ...state,
        profileChannel: action.payload,
      };
    default:
      return state;
  }
};
export {channelReducer, channelState};
