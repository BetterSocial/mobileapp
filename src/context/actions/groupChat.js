import {SET_ASSET_GROUP_CHAT, SET_PARTICIPANTS_GROUP_CHAT} from '../Types';

export const setAsset = (data, dispatch) => {
  dispatch({
    payload: data,
    type: SET_ASSET_GROUP_CHAT,
  });
};

export const setParticipants = (data, dispatch) => {
  dispatch({
    payload: data,
    type: SET_PARTICIPANTS_GROUP_CHAT,
  });
};
