import {SET_TOTAL_UN_READ_MESSAGE, SET_UN_READ_MESSAGE} from '../Types';

export const unReadMessageState = {
  total_unread_count: null,
  unread_channels: null,
  unread_count: null,
};

export const unReadMessageReducer = (state = unReadMessageState, action) => {
  switch (action.type) {
    case SET_UN_READ_MESSAGE:
      return {
        ...action.payload,
      };
    case SET_TOTAL_UN_READ_MESSAGE:
      return {
        total_unread_count: action.payload,
        unread_channels: state.unread_channels,
        unread_count: state.unread_count,
      };
    default:
      return state;
  }
};
