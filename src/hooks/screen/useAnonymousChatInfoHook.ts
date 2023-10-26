import * as React from 'react';
import {useNavigation} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChatInfoScreenHook from '../../../types/hooks/screens/useAnonymousChatInfoScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {ChannelListMemberSchema} from '../../../types/database/schema/ChannelList.types';
import {getAnonymousUserId, getUserId} from '../../utils/users';
import {Context} from '../../context';

function useAnonymousChatInfoScreenHook(): UseAnonymousChatInfoScreenHook {
  const {localDb, channelList} = useLocalDatabaseHook();
  const {selectedChannel, goBack} = useChatUtilsHook();
  const [myUserId] = React.useContext(Context).profile;
  const navigation = useNavigation();

  const [channelInfo, setChannelInfo] = React.useState(null);
  console.log({myUserId}, 'sipo');
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
    console.log(data, 'nanak');
    setChannelInfo(data);
  };

  const onContactPressed = (item: ChannelListMemberSchema) => {
    if (!item?.user?.isMe)
      navigation.push('OtherProfile', {
        data: {
          user_id: myUserId?.myProfile?.user_id,
          other_id: item?.user_id,
          username: item?.user?.name
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
