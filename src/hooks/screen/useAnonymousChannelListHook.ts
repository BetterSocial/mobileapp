import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseAnonymousChannelListScreenHook from '../../../types/hooks/screens/useAnonymousChannelListScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';
import {getLatestTopicPost} from '../../service/topics';

function useAnonymousChannelListScreenHook(): UseAnonymousChannelListScreenHook {
  const {localDb, channelList, refresh} = useLocalDatabaseHook();
  const {goToChatScreen, goToPostDetailScreen, goToContactScreen, goToCommunityScreen} =
    useChatUtilsHook();

  const [channels, setChannels] = React.useState([]);

  const initChannelListData = async () => {
    if (!localDb) return;
    const myId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getAllAnonymousChannelList(localDb, myId, myAnonymousId);
    setChannels(data);
  };

  const fetchLatestTopicPost = async (topicId: string) => {
    const cleanTopicName = topicId?.replace('topic_', '');
    const response = await getLatestTopicPost(cleanTopicName);
    if (!response || !localDb) return;

    await ChannelList.updateChannelDescription(
      localDb,
      topicId,
      response?.message,
      null,
      true,
      response?.expired_at
    );
    refresh('channelList');
  };

  React.useEffect(() => {
    initChannelListData();
  }, [localDb, channelList]);

  return {
    channels,
    goToChatScreen,
    goToPostDetailScreen,
    goToContactScreen,
    goToCommunityScreen,
    fetchLatestTopicPost
  };
}

export default useAnonymousChannelListScreenHook;
