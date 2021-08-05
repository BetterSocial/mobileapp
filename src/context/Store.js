import * as React from 'react';

import {
  localCommunityReducer,
  localCommunityState,
} from './reducers/localComunityReducer';
import {topicsReducer, topicsState} from './reducers/topicsReducer';
import {usersReducer, usersState} from './reducers/userReducer';
import {channelReducer, channelState} from './reducers/channelReducer';
import {clientReducer, clientState} from './reducers/clientReducer';
import {myProfileReducer, myProfileState} from './reducers/myProfileReducer';

const Store = ({children}) => {
  const rootReducer = {
    users: React.useReducer(usersReducer, usersState),
    localCommunity: React.useReducer(
      localCommunityReducer,
      localCommunityState,
    ),
    topics: React.useReducer(topicsReducer, topicsState),
    channel: React.useReducer(channelReducer, channelState),
    client: React.useReducer(clientReducer, clientState),
    myProfile: React.useReducer(myProfileReducer, myProfileState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = React.createContext(null);
export default Store;
