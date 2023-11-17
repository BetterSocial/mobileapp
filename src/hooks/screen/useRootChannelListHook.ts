import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';

const useRootChannelListHook = () => {
  const {localDb, chat, channelList} = useLocalDatabaseHook();
  const [signedChannelUnreadCount, setSignedChannelUnreadCount] = React.useState(0);
  const [anonymousChannelUnreadCount, setAnonymousChannelUnreadCount] = React.useState(0);
  const [totalUnreadCount, setTotalUnreadCount] = React.useState(0);

  const getSignedChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'SIGNED');
      setSignedChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  const getAnonymousChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'ANON');
      setAnonymousChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    getSignedChannelUnreadCount().catch((e) => console.log(e));
    getAnonymousChannelUnreadCount().catch((e) => console.log(e));
  }, [localDb, chat, channelList]);

  React.useEffect(() => {
    setTotalUnreadCount(signedChannelUnreadCount + anonymousChannelUnreadCount);
  }, [signedChannelUnreadCount, anonymousChannelUnreadCount]);

  return {
    signedChannelUnreadCount,
    anonymousChannelUnreadCount,
    totalUnreadCount
  };
};

export default useRootChannelListHook;
