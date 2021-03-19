import {SET_DATA_HUMAN_ID, SET_DATA_IMAGE, SET_DATA_USERNAME, SET_LOCAL_COMUNITY} from '../Types';

export const setDataHumenId = async (data, dispatch) => {
  let {appUserId, countryCode} = data;
  dispatch({
    type: SET_DATA_HUMAN_ID,
    payload: {
      userId: appUserId,
      countryCode: countryCode,
    },
  });
};
export const setImage = (base64, dispatch) => {
  dispatch({
    type: SET_DATA_IMAGE,
    payload: base64,
  });
};
export const setUsername = (username, dispatch) => {
  dispatch({
    type: SET_DATA_USERNAME,
    payload: username,
  });
};
export const setLocalCommunity = (location, dispatch) => {
  console.log('isi location user ', location)
  dispatch({
    type: SET_LOCAL_COMUNITY,
    payload: location,
  });
};
