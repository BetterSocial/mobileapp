import {SET_UN_READ_MESSAGE, SET_TOTAL_UN_READ_MESSAGE} from '../Types';

export const setUnReadMessage = (unReadMessage) => {
  return {
    type: SET_UN_READ_MESSAGE,
    payload: unReadMessage,
  };
};

export const setTotalUnReadMessage = (totalUnReadMessage) => {
  return {
    type: SET_TOTAL_UN_READ_MESSAGE,
    payload: totalUnReadMessage,
  };
};
