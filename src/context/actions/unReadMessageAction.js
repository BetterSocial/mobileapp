import {SET_UN_READ_MESSAGE} from '../Types';

export const setUnReadMessage = (unReadMessage) => {
  return {
    type: SET_UN_READ_MESSAGE,
    payload: unReadMessage,
  };
};
