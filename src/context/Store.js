import React, {createContext, useReducer} from 'react';
import {usersReducer, usersState} from './reducers/userReducer';

const Store = ({children}) => {
  const rootReducer = {
    users: useReducer(usersReducer, usersState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = createContext(null);
export default Store;
