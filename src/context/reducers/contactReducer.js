import {SET_FEED, SET_FEED_BY_ID, ADD_CONTACT_LIST} from '../Types';

const contactsState = {
  contacts: [],
};
const isInArray = (value, array) => {
  return array.indexOf(value);
};
const contactReducer = (state = contactsState, action) => {
  switch (action.type) {
    case ADD_CONTACT_LIST:
      let newcontacts = [...state.contacts];
      //   newcontacts[action.payload.index] = action.payload.id;
      let isAvailable = isInArray(newcontacts, selectedUsers);
      if (isAvailable > -1) {
        selectedUsers.splice(isAvailable, 1);
        setSelectedUsers(selectedUsers);
      } else {
        selectedUsers.push(item);
        setSelectedUsers(selectedUsers);
      }

      return {
        ...state,
        contacts: newcontacts,
      };
    default:
      return state;
  }
};
export {contactReducer, contactsState};
