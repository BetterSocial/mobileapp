import {SET_MY_PROFILE} from '../Types';

const myProfileState = {
  myProfile: {},
};
const myProfileReducer = (state = myProfileState, action) => {
  switch (action.type) {
    case SET_MY_PROFILE:
      return {
        ...action.payload,
      };
    default:
      return state;
  }
};
export {myProfileReducer, myProfileState};
