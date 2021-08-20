import {SET_MY_PROFILE} from '../Types';

export const setMyProfileAction = (profile, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE,
    payload: profile,
  });
};
