import * as React from 'react';

import {
  localCommunityReducer,
  localCommunityState,
} from './reducers/localComunityReducer';
import {topicsReducer, topicsState} from './reducers/topicsReducer';
import {usersReducer, usersState} from './reducers/userReducer';
import {channelReducer, channelState} from './reducers/channelReducer';
import {clientReducer, clientState} from './reducers/clientReducer';
import {newsReducer, newsState} from './reducers/newsReducer';
import {feedsReducer, feedsState} from './reducers/FeedReducer';
import {myProfileReducer, myProfileState} from './reducers/myProfileReducer';
import {groupChatReducer, groupChatState} from './reducers/groupChat';

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
    news: React.useReducer(newsReducer, newsState),
    feeds: React.useReducer(feedsReducer, feedsState),
    profile: React.useReducer(myProfileReducer, myProfileState),
    groupChat: React.useReducer(groupChatReducer, groupChatState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = React.createContext(null);
export default Store;
