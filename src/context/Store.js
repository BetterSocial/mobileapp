import * as React from 'react';

import {feedsReducer, feedsState} from './reducers/FeedReducer';
import {channelReducer, channelState} from './reducers/channelReducer';
import {clientReducer, clientState} from './reducers/clientReducer';
import {groupChatReducer, groupChatState} from './reducers/groupChat';
import {
  localCommunityReducer,
  localCommunityState,
} from './reducers/localComunityReducer';
import {
  myProfileFeedReducer,
  myProfileFeedState,
} from './reducers/myProfileFeedReducer';
import {myProfileReducer, myProfileState} from './reducers/myProfileReducer';
import {newsReducer, newsState} from './reducers/newsReducer';
import {topicsReducer, topicsState} from './reducers/topicsReducer';
import {
  unReadMessageReducer,
  unReadMessageState,
} from './reducers/unReadMessageReducer';
import {usersReducer, usersState} from './reducers/userReducer';

const Store = ({children}) => {
  const rootReducer = {
    channel: React.useReducer(channelReducer, channelState),
    client: React.useReducer(clientReducer, clientState),
    feeds: React.useReducer(feedsReducer, feedsState),
    groupChat: React.useReducer(groupChatReducer, groupChatState),
    localCommunity: React.useReducer(
      localCommunityReducer,
      localCommunityState,
    ),
    myProfileFeed: React.useReducer(myProfileFeedReducer, myProfileFeedState),
    news: React.useReducer(newsReducer, newsState),
    profile: React.useReducer(myProfileReducer, myProfileState),
    topics: React.useReducer(topicsReducer, topicsState),
    unReadMessage: React.useReducer(unReadMessageReducer, unReadMessageState),
    users: React.useReducer(usersReducer, usersState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = React.createContext(null);
export default Store;
