import * as React from 'react';

import { channelReducer, channelState } from './reducers/channelReducer';
import { clientReducer, clientState } from './reducers/clientReducer';
import { discoveryReducer, discoveryState } from './reducers/discoveryReducer';
import { domainReducer, domainState } from './reducers/domainReducer';
import { feedsReducer, feedsState } from './reducers/FeedReducer';
import { generalComponentReducer, generalComponentState } from './reducers/generalComponentReducer';
import { groupChatReducer, groupChatState } from './reducers/groupChat';
import {
  localCommunityReducer,
  localCommunityState,
} from './reducers/localComunityReducer';
import {
  myProfileFeedReducer,
  myProfileFeedState,
} from './reducers/myProfileFeedReducer';
import { myProfileReducer, myProfileState } from './reducers/myProfileReducer';
import { newsReducer, newsState } from './reducers/newsReducer';
import { otherProfileFeedReducer, otherProfileFeedState } from './reducers/OtherProfileFeedReducer';
import { topicsReducer, topicsState } from './reducers/topicsReducer';
import {
  unReadMessageReducer,
  unReadMessageState,
} from './reducers/unReadMessageReducer';
import { usersReducer, usersState } from './reducers/userReducer';

/**
 * 
 * @typedef {Object} MainContext 
 * @property {import('./reducers/discoveryReducer').DiscoveryState} discovery
 */
const Store = ({ children }) => {
  const rootReducer = {
    channel: React.useReducer(channelReducer, channelState),
    client: React.useReducer(clientReducer, clientState),
    discovery: React.useReducer(discoveryReducer, discoveryState),
    feeds: React.useReducer(feedsReducer, feedsState),
    generalComponent: React.useReducer(generalComponentReducer, generalComponentState),
    groupChat: React.useReducer(groupChatReducer, groupChatState),
    localCommunity: React.useReducer(
      localCommunityReducer,
      localCommunityState,
    ),
    myProfileFeed: React.useReducer(myProfileFeedReducer, myProfileFeedState),
    otherProfileFeed: React.useReducer(otherProfileFeedReducer, otherProfileFeedState),
    news: React.useReducer(newsReducer, newsState),
    profile: React.useReducer(myProfileReducer, myProfileState),
    topics: React.useReducer(topicsReducer, topicsState),
    unReadMessage: React.useReducer(unReadMessageReducer, unReadMessageState),
    users: React.useReducer(usersReducer, usersState),
    domains: React.useReducer(domainReducer, domainState),
  };
  return <Context.Provider value={rootReducer}>{children}</Context.Provider>;
};
export const Context = React.createContext(null);
export default Store;
