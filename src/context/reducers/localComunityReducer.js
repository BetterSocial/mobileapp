import {SET_LOCAL_COMUNITY} from '../Types';

const localCommunityState = {
  local_community: ['61573']
};
const localCommunityReducer = (state = localCommunityState, action) => {
  switch (action.type) {
    case SET_LOCAL_COMUNITY:
      return {
        local_community: action.payload
      };
    default:
      return state;
  }
};
export {localCommunityReducer, localCommunityState};
