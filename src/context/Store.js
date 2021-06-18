import * as React from 'react';

import {
  localCommunityReducer,
  localCommunityState,
} from './reducers/localComunityReducer';
import {topicsReducer, topicsState} from './reducers/topicsReducer';
import {usersReducer, usersState} from './reducers/userReducer';

const Store = ({children}) => {
  const rootReducer = {
    users: React.useReducer(usersReducer, usersState),
    localCommunity: React.useReducer(
      localCommunityReducer,
      localCommunityState,
    ),
    topics: React.useReducer(topicsReducer, topicsState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = React.createContext(null);
export default Store;
