import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseSignedChannelListScreenHook from '../../../types/hooks/screens/useSignedChannelListScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId, getUserId} from '../../utils/users';

function useSignedChannelListScreenHook(): UseSignedChannelListScreenHook {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {goToChatScreen, goToPostDetailScreen} = useChatUtilsHook();

  const [channels, setChannels] = React.useState([]);

  const initializeChannelListData = async () => {
    if (!localDb) return;
    const myId = await getUserId();

    //! TODO:
    //! REMOVE ANONYMOUSID
    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getAll(localDb, myId, myAnonymousId);
    console.log({data}, 'nanikla');
    setChannels(data);
  };

  React.useEffect(() => {
    console.log('jalan');
    initializeChannelListData();
  }, [localDb, channelList]);

  return {
    channels,
    goToChatScreen,
    goToPostDetailScreen
  };
}

export default useSignedChannelListScreenHook;
