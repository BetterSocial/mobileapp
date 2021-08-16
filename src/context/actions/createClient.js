import {SET_CLIENT} from '../Types';
export const createClient = async (client, dispatch) => {
  await dispatch({
    type: SET_CLIENT,
    payload: client,
  });
};
