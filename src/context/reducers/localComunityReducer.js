import {SET_LOCAL_COMUNITY} from '../Types';

const localCommunityState = {
  local_community: [],
};
const localCommunityReducer = (state = localCommunityState, action) => {
  switch (action.type) {
    case SET_LOCAL_COMUNITY:
      return {
        local_community: action.payload,
      };
    default:
      return state;
  }
};
export {localCommunityReducer, localCommunityState};
