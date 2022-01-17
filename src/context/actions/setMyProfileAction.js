import {  NAVBAR_TITLE_MY_PROFILE , SET_MY_PROFILE } from '../Types';

export const setMyProfileAction = (profile, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE,
    payload: profile,
  });
};

export const setNavbarTitle = (title, dispatch) => {
  dispatch({
    type: NAVBAR_TITLE_MY_PROFILE,
    payload: title,
  });
};
