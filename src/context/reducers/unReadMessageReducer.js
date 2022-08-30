import {COUNT_POST_NOTIF, SET_TOTAL_UN_READ_MESSAGE, SET_UN_READ_MESSAGE} from '../Types';

export const unReadMessageState = {
  total_unread_count: 0,
  unread_channels: 0,
  unread_count: 0,
  unread_post: 0
};

export const unReadMessageReducer = (state = unReadMessageState, action) => {
  switch (action.type) {
    case SET_UN_READ_MESSAGE:
      return {
        ...state,
        ...action.payload,
      };
    case SET_TOTAL_UN_READ_MESSAGE:
      return {
       ...state,
        total_unread_count: action.payload,
      };
    case COUNT_POST_NOTIF:
      return {
        ...state,
        unread_post: action.payload
      }
    default:
      return state;
  }
};
