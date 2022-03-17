import { SET_FOLLOWING_DOMAIN, SET_FOLLOWING_TOPICS, SET_FOLLOWING_USER } from '../Types';

const followingState = {
  domains: [],
  users: [],
  topics: [],
};
const followingReducer = (state = followingState, action) => {
  switch (action.type) {
    case SET_FOLLOWING_DOMAIN:
      return {
        ...state,
        domains: action.payload,
      };
    case SET_FOLLOWING_TOPICS:
      return {
        ...state,
        topics: action.payload,
      };
    case SET_FOLLOWING_USER:
      return {
        ...state,
        users: action.payload,
      };
    default:
      return state;
  }
};
export { followingReducer, followingState };
