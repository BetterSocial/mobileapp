import {SET_CHANNEL} from '../Types';

export const setChannel = (channel, dispatch) => {
  dispatch({
    type: SET_CHANNEL,
    payload: channel,
  });
};
