import {SET_LOCAL_COMUNITY} from '../Types';

export const setLocalCommunity = (location, dispatch) => {
  dispatch({
    type: SET_LOCAL_COMUNITY,
    payload: location,
  });
};
