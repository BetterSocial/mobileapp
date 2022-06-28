import { SET_ASSET_GROUP_CHAT } from '../Types';

export const rejuvenateApp = (data, dispatch) => {
  dispatch({
    type: 'SET_INITIAL_STARTUP',
    payload: data,
  });
}
