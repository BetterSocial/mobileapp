import {SET_UN_READ_MESSAGE} from '../Types';

export const unReadMessageState = {
  total_unread_count: null,
  unread_channels: null,
  unread_count: null,
};

export const unReadMessageReducer = (state = unReadMessageState, action) => {
  switch (action.type) {
    case SET_UN_READ_MESSAGE:
      let data = {
        ...action.payload,
      };
      return data;
    default:
      return state;
  }
};
