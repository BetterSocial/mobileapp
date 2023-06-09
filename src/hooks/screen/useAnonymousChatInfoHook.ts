import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChatInfoScreenHook from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';

function useAnonymousChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {selectedChannel, goBack} = useChatUtilsHook();

  const [channelInfo, setChannelInfo] = React.useState(null);

  const initChatInfoData = async () => {
    if (!localDb) return;
    const myId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getChannelInfo(
      localDb,
      selectedChannel?.id,
      myId,
      myAnonymousId
    );
    setChannelInfo(data);
  };

  React.useEffect(() => {
    initChatInfoData();
  }, [localDb, channelList]);

  return {
    channelInfo,
    goBack
  };
}

export default useAnonymousChatInfoScreenHook;
