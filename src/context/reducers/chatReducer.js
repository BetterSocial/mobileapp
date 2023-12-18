import {SET_REPLY_TARGET} from '../Types';

const chatState = {
  replyTarget: null
};
const chatReducer = (state = chatState, action) => {
  switch (action.type) {
    case SET_REPLY_TARGET:
      return {
        ...state,
        replyTarget: action.payload
      };
    default:
      return state;
  }
};
export {chatReducer, chatState};
