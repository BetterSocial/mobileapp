import {SET_MY_PROFILE, NAVBAR_TITLE_MY_PROFILE} from '../Types';

export const setMyProfileAction = (profile, dispatch) => {
  dispatch({
    type: SET_MY_PROFILE,
    payload: profile,
  });
};

export const setNavbarTitle = (title, dispatch) => {
  console.log(title, 'sukaku')
  dispatch({
    type: NAVBAR_TITLE_MY_PROFILE,
    payload: title
  })
}