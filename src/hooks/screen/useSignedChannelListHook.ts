import * as React from 'react';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseSignedChannelListScreenHook from '../../../types/hooks/screens/useSignedChannelListScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getLatestTopicPost} from '../../service/topics';
import {getUserId} from '../../utils/token';

function useSignedChannelListScreenHook(): UseSignedChannelListScreenHook {
  const {localDb, channelList, refresh} = useLocalDatabaseHook();
  const {goToChatScreen, goToPostDetailScreen, goToCommunityScreen, goToContactScreen} =
    useChatUtilsHook();

  const [channels, setChannels] = React.useState([]);

  const initializeChannelListData = async () => {
    if (!localDb) return;
    const myId = await getUserId();

    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getAll(localDb, myId, myAnonymousId);
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
      response?.duration
    );
    refresh('channelList');
  };

  React.useEffect(() => {
    initializeChannelListData();
  }, [localDb, channelList]);

  return {
    channels,
    fetchLatestTopicPost,
    goToChatScreen,
    goToPostDetailScreen,
    goToCommunityScreen,
    goToContactScreen
  };
}

export default useSignedChannelListScreenHook;
