import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import useFeedService from '../useFeedService';
import useFetchAnonymousChannelHook from '../core/chat/useFetchAnonymousChannelHook';
import useFetchAnonymousPostNotificationHook from '../core/chat/useFetchAnonymousPostNotificationHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';

const useRootChannelListHook = () => {
  const {localDb, chat, channelList} = useLocalDatabaseHook();
  const [signedChannelUnreadCount, setSignedChannelUnreadCount] = React.useState(0);
  const [anonymousChannelUnreadCount, setAnonymousChannelUnreadCount] = React.useState(0);

  const getSignedChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'SIGNED');
      setSignedChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  const {getAllAnonymousChannels} = useFetchAnonymousChannelHook();
  const {getAllAnonymousPostNotifications} = useFetchAnonymousPostNotificationHook();
  const {getFeedChat} = useFeedService();

  const getAnonymousChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'ANON');
      setAnonymousChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  const refreshAnonymousChannelList = () => {
    getAllAnonymousChannels().catch((e) => console.log(e));
    getAllAnonymousPostNotifications().catch((e) => console.log(e));
  };

  const refreshSignedChannelList = () => {
    getFeedChat().catch((e) => console.log(e));
  };

  React.useEffect(() => {
    getSignedChannelUnreadCount().catch((e) => console.log(e));
    getAnonymousChannelUnreadCount().catch((e) => console.log(e));
  }, [localDb, chat, channelList]);

  return {
    signedChannelUnreadCount,
    totalUnreadCount: anonymousChannelUnreadCount + signedChannelUnreadCount,
    refreshAnonymousChannelList,
    refreshSignedChannelList,
    anonymousChannelUnreadCount
  };
};

export default useRootChannelListHook;
