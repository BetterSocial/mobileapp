import {SET_CHANNEL} from '../Types';

const channelState = {
  channel: null,
};
const channelReducer = (state = channelState, action) => {
  switch (action.type) {
    case SET_CHANNEL:
      return {
        ...state,
        channel: action.payload,
      };
    default:
      return state;
  }
};
export {channelReducer, channelState};
