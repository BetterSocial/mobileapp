import {
  NAVBAR_TITLE_MY_PROFILE,
  SET_MY_PROFILE,
  SET_MY_PROFILE_RESET_ALL,
  SHOW_HEADER_NAVBAR
} from '../Types';

export const setMyProfileAction = (profile, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE,
    payload: profile
  });
};

export const setNavbarTitle = (title, dispatch) => {
  dispatch({
    type: NAVBAR_TITLE_MY_PROFILE,
    payload: title
  });
};
export const showHeaderProfile = (isShow, dispatch) => {
  dispatch({
    type: SHOW_HEADER_NAVBAR,
    payload: isShow
  });
};

export const setMyProfileResetAll = (dispatch) => {
  dispatch({
    type: SET_MY_PROFILE_RESET_ALL
  });
};
