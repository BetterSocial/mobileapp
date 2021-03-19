import {
  SET_DATA_HUMAN_ID,
  SET_DATA_IMAGE,
  SET_DATA_USERNAME,
  SET_LOCAL_COMUNITY,
} from '../Types';

const usersState = {
  userId: null,
  countryCode: null,
  photo: null,
  username: null,
  local_community: [],
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
    case SET_LOCAL_COMUNITY:
      console.log('isi action.payload.location ', action.payload.location)
      return {
        local_community: action.payload.location
      };
    default:
      return state;
  }
};
export {usersReducer, usersState};
