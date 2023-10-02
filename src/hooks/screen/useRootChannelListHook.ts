import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {Context} from '../../context';

const useRootChannelListHook = () => {
  const [unreadMessage] = React.useContext(Context).unReadMessage;

  const {localDb, chat, channelList} = useLocalDatabaseHook();
  const [anonymousChannelUnreadCount, setAnonymousChannelUnreadCount] = React.useState(0);
  const [signedChannelUnreadCount, setSignedChannelUnreadCount] = React.useState(0);

  const getAnonymousChannelUnreadCount = async () => {
    if (!localDb) return;
    try {
      const unreadCount = await ChannelList.getUnreadCount(localDb, 'ANON');
      setAnonymousChannelUnreadCount(unreadCount);
    } catch (e) {
      console.log(e);
    }
  };

  const getSignedChannelUnreadCount = async () => {
    let unreadCount = 0;
    unreadCount += unreadMessage?.total_unread_count || 0;
    unreadCount += unreadMessage?.unread_post || 0;

    setSignedChannelUnreadCount(unreadCount);
  };

  React.useEffect(() => {
    getAnonymousChannelUnreadCount().catch((e) => console.log(e));
  }, [localDb, chat, channelList]);

  React.useEffect(() => {
    getSignedChannelUnreadCount().catch((e) => console.log(e));
  }, [unreadMessage]);

  return {
    anonymousChannelUnreadCount,
    signedChannelUnreadCount,
    totalUnreadCount: anonymousChannelUnreadCount + signedChannelUnreadCount
  };
};

export default useRootChannelListHook;
