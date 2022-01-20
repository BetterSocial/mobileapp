import {NAVBAR_TITLE_MY_PROFILE, SET_MY_PROFILE, SHOW_HEADER_NAVBAR} from '../Types';

const myProfileState = {
  myProfile: {},
  navbarTitle: "Who you're following",
  isShowHeader: true
};
const myProfileReducer = (state = myProfileState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE:
      return {
        ...state,
        myProfile: action.payload
      };
    case NAVBAR_TITLE_MY_PROFILE:
      return {
        ...state,
        navbarTitle: action.payload
      }
    case SHOW_HEADER_NAVBAR:
      return {
        ...state,
        isShowHeader: action.payload
      }
    default:
      return state;
  }
};
export {myProfileReducer, myProfileState};
