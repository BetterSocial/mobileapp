import {SET_ASSET_GROUP_CHAT, SET_PARTICIPANTS_GROUP_CHAT} from '../Types';

const groupChatState = {
  asset: [],
  participants: []
};
const groupChatReducer = (state = groupChatState, action) => {
  switch (action.type) {
    case SET_ASSET_GROUP_CHAT:
      return {
        ...state,
        asset: action.payload
      };
    case SET_PARTICIPANTS_GROUP_CHAT:
      return {
        ...state,
        participants: action.payload
      };
    default:
      return state;
  }
};
export {groupChatReducer, groupChatState};
