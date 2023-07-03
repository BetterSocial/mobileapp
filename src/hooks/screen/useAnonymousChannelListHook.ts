import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChannelListScreenHook from '../../../types/hooks/screens/useAnonymousChannelListScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';

function useAnonymousChannelListScreenHook(): UseAnonymousChannelListScreenHook {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {goToChatScreen, goToPostDetailScreen} = useChatUtilsHook();

  const [channels, setChannels] = React.useState([]);

  const initChannelListData = async () => {
    if (!localDb) return;
    const myId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getAll(localDb, myId, myAnonymousId);
    setChannels(data);
  };

  React.useEffect(() => {
    initChannelListData();
  }, [localDb, channelList]);

  return {
    channels,
    goToChatScreen,
    goToPostDetailScreen
  };
}

export default useAnonymousChannelListScreenHook;
