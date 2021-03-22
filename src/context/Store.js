import React, {createContext, useReducer} from 'react';
import {
  localCommunityReducer,
  localCommunityState,
} from './reducers/localComunityReducer';
import {topicsReducer, topicsState} from './reducers/topicsReducer';
import {usersReducer, usersState} from './reducers/userReducer';

const Store = ({children}) => {
  const rootReducer = {
    users: useReducer(usersReducer, usersState),
    localCommunity: useReducer(localCommunityReducer, localCommunityState),
    topics: useReducer(topicsReducer, topicsState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = createContext(null);
export default Store;
