import * as React from 'react';
import {useNavigation} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChatInfoScreenHook from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';

function useAnonymousChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {selectedChannel, goBack} = useChatUtilsHook();

  const navigation = useNavigation();

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

  const onContactPressed = (item: ChannelListMemberSchema) => {
    if (!item?.user?.isMe)
      navigation.push('OtherProfile', {
        data: {
          user_id: item?.userId,
          other_id: item?.userId,
          username: item?.user?.username
        }
      });
  };

  React.useEffect(() => {
    initChatInfoData();
  }, [localDb, channelList]);

  return {
    channelInfo,
    goBack,
    onContactPressed
  };
}

export default useAnonymousChatInfoScreenHook;
