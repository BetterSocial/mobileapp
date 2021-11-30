import {SET_MY_PROFILE_FEED} from '../Types';

export const setMyProfileFeed = (data, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE_FEED,
    payload: data,
  });
};

