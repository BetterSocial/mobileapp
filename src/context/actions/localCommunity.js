import {SET_LOCAL_COMUNITY} from '../Types';

export const setLocalCommunity = (location, dispatch) => {
  console.log('isi location user ', location);
  dispatch({
    type: SET_LOCAL_COMUNITY,
    payload: location,
  });
};
