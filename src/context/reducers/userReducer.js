import {SET_DATA_HUMAN_ID, SET_DATA_IMAGE, SET_DATA_USERNAME} from '../Types';

const usersState = {
  userId: null,
  countryCode: null,
  photo: null,
  username: null,
};
const usersReducer = (state = usersState, action) => {
  switch (action.type) {
    case SET_DATA_IMAGE:
      return {
        photo: action.payload,
      };
    case SET_DATA_USERNAME:
      return {
        username: action.payload,
      };
    case SET_DATA_HUMAN_ID:
      return {
        userId: action.payload.userId,
        countryCode: action.payload.countryCode,
      };
    default:
      return state;
  }
};
export {usersReducer, usersState};
