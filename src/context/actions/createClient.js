import {SET_CHAT_CLIENT, SET_CLIENT} from '../Types';
export const createClient = async (client, dispatch) => {
  await dispatch({
    type: SET_CLIENT,
    payload: client,
  });
};

export const createChatClient = (client, dispatch) => {
  dispatch({
    types: SET_CHAT_CLIENT,
    payload:client
  })
}


