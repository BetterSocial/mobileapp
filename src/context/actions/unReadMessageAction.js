import {SET_UN_READ_MESSAGE, SET_TOTAL_UN_READ_MESSAGE, COUNT_POST_NOTIF} from '../Types';

export const setUnReadMessage = (unReadMessage) => ({
    type: SET_UN_READ_MESSAGE,
    payload: unReadMessage,
  });

export const setTotalUnReadMessage = (totalUnReadMessage) => ({
    type: SET_TOTAL_UN_READ_MESSAGE,
    payload: totalUnReadMessage,
  });

export const setTotalUnreadPostNotif = (totalMessage) => ({
  type: COUNT_POST_NOTIF,
  payload: totalMessage
})