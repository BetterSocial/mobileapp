import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';

const useAnonymousChannelListScreenHook = () => {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {goToChatScreen} = useChatUtilsHook();

  const [channels, setChannels] = React.useState([]);

  const initChannelListData = async () => {
    if (!localDb) return;
    const data = await ChannelList.getAll(localDb);
    setChannels(data);
  };

  React.useEffect(() => {
    initChannelListData();
  }, [localDb, channelList]);

  return {
    channels,
    goToChatScreen
  };
};

export default useAnonymousChannelListScreenHook;
