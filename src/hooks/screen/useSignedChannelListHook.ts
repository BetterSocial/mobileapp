import * as React from 'react';
import {useNavigation} from '@react-navigation/core';

import ChannelList from '../../database/schema/ChannelListSchema';
import UseSignedChannelListScreenHook from '../../../types/hooks/screens/useSignedChannelListScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {convertTopicNameToTopicPageScreenParam} from '../../utils/string/StringUtils';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';

function useSignedChannelListScreenHook(): UseSignedChannelListScreenHook {
  const navigation = useNavigation();
  const {localDb, channelList} = useLocalDatabaseHook();
  const {goToChatScreen, goToPostDetailScreen} = useChatUtilsHook();

  const [channels, setChannels] = React.useState([]);

  const initializeChannelListData = async () => {
    if (!localDb) return;
    const myId = await getUserId();

    const myAnonymousId = await getAnonymousUserId();
    const data = await ChannelList.getAll(localDb, myId, myAnonymousId);
    setChannels(data);
  };

  React.useEffect(() => {
    initializeChannelListData();
  }, [localDb, channelList]);

  const goToCommunityScreen = (channel) => {
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(channel.name)
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  return {
    channels,
    goToChatScreen,
    goToPostDetailScreen,
    goToCommunityScreen
  };
}

export default useSignedChannelListScreenHook;
