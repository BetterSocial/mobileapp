import {SET_CHANNEL, SET_PROFILE_CHANNEL} from '../Types';

export const setChannel = (channel, dispatch) => {
  dispatch({
    type: SET_CHANNEL,
    payload: channel,
  });
};

export const setProfileChannel = (image, dispatch) => {
  dispatch({
    type: SET_PROFILE_CHANNEL,
    payload: image,
  });
};
