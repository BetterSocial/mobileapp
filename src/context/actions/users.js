import {
  SET_DATA_HUMAN_ID,
  SET_DATA_IMAGE,
  SET_DATA_IMAGE_URL,
  SET_DATA_USERNAME,
} from '../Types';
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
export const setImageUrl = (url, dispatch) => {
  dispatch({
    type: SET_DATA_IMAGE_URL,
    payload: url,
  });
};
export const setUsername = (username, dispatch) => {
  dispatch({
    type: SET_DATA_USERNAME,
    payload: username,
  });
};
