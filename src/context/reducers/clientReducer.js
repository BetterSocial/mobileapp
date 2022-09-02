import {SET_CHAT_CLIENT, SET_CLIENT} from '../Types';

const clientState = {
  client: null,
  chatClient: null
};
const clientReducer = (state = clientState, action) => {
  switch (action.type) {
    case SET_CLIENT:
      return {
        ...state,
        client: action.payload,
      };
    case SET_CHAT_CLIENT:
      return {
        ...state,
        chatClient: action.payload
      }
    default:
      return state;
  }
};
export {clientReducer, clientState};
