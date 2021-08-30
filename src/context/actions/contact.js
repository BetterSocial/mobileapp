import {ADD_CONTACT_LIST} from '../Types';

export const addContactList = (data, dispatch) => {
  dispatch({
    type: ADD_CONTACT_LIST,
    payload: data,
  });
};
