import * as React from 'react';
import {useNavigation} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseSignedChatInfoScreenHook from '../../../types/hooks/screens/useSignedChatInfoScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';

function useSignedChatInfoScreenHook(): UseSignedChatInfoScreenHook {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {selectedChannel, goBack} = useChatUtilsHook();
  const navigation = useNavigation();

  const [channelInfo, setChannelInfo] = React.useState(null);

  const initializeChatInfoData = async () => {
    if (!localDb) return;
    const myId = await getUserId();

    //! TODO:
    //! REMOVE ANONYMOUSID
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
      navigation.navigate('OtherProfile', {
        data: {
          user_id: item?.userId,
          other_id: item?.userId,
          username: item?.user?.username
        }
      });
  };

  React.useEffect(() => {
    initializeChatInfoData();
  }, [localDb, channelList]);

  return {
    channelInfo,
    goBack,
    onContactPressed
  };
}

export default useSignedChatInfoScreenHook;
