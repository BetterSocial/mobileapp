import {
  SET_DATA_HUMAN_ID,
  SET_DATA_IMAGE,
  SET_DATA_IMAGE_URL,
  SET_DATA_USERNAME,
  SET_MY_PROFILE_INFORMATIO
} from '../Types';

export const setDataHumenId = async (data, dispatch) => {
  const {appUserId, countryCode} = data || {};
  dispatch({
    type: SET_DATA_HUMAN_ID,
    payload: {
      userId: appUserId,
      countryCode
    }
  });
};
export const setImage = (base64, dispatch) => {
  dispatch({
    type: SET_DATA_IMAGE,
    payload: base64
  });
};
export const setImageUrl = (url, dispatch) => {
  dispatch({
    type: SET_DATA_IMAGE_URL,
    payload: url
  });
};
export const setUsername = (username, dispatch) => {
  dispatch({
    type: SET_DATA_USERNAME,
    payload: username
  });
};

export const setMyProfileData = (profileData, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE_INFORMATIO,
    payload: profileData
  });
};
