import {DEFAULT_PROFILE_PIC_PATH} from '../../utils/constants';
import {
  SET_DATA_HUMAN_ID,
  SET_DATA_IMAGE,
  SET_DATA_IMAGE_URL,
  SET_DATA_USERNAME,
  SET_MY_PROFILE_INFORMATIO
} from '../Types';

const usersState = {
  userId: null,
  countryCode: null,
  photo: null,
  username: null,
  photoUrl: DEFAULT_PROFILE_PIC_PATH,
  profileInformation: {}
};
const usersReducer = (state = usersState, action) => {
  switch (action.type) {
    case SET_DATA_IMAGE:
      return {
        ...state,
        photo: action.payload
      };
    case SET_DATA_USERNAME:
      return {
        ...state,
        username: action.payload
      };
    case SET_DATA_HUMAN_ID:
      return {
        ...state,
        userId: action.payload.userId,
        countryCode: action.payload.countryCode
      };
    case SET_DATA_IMAGE_URL:
      return {
        ...state,
        photoUrl: action.payload
      };
    case SET_MY_PROFILE_INFORMATIO:
      return {
        ...state,
        profileInformation: action.payload
      };
    default:
      return state;
  }
};
export {usersReducer, usersState};
