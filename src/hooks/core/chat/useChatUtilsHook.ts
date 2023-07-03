import SimpleToast from 'react-native-simple-toast';
import {atom, useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import UseChatUtilsHook from '../../../../types/hooks/screens/useChatUtilsHook.types';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ChannelList} from '../../../../types/database/schema/ChannelList.types';
import {PostNotificationChannelList} from '../../../../types/database/schema/PostNotificationChannelList.types';

const chatAtom = atom({
  key: 'chatAtom',
  default: {
    selectedChannel: null
  }
});

function useChatUtilsHook(): UseChatUtilsHook {
  const [chat, setChat] = useRecoilState(chatAtom);
  const {localDb, refresh} = useLocalDatabaseHook();
  const navigation = useNavigation();
  const {selectedChannel} = chat;

  const setChannelAsRead = (channel: ChannelList) => {
    if (!localDb) return;
    channel.setRead(localDb).catch((e) => console.log('setChannelAsRead error', e));

    AnonymousMessageRepo.setChannelAsRead(channel?.id).catch((e) => {
      console.log('setChannelAsRead error', e);
    });

    refresh('channelList');
  };

  const setSelectedChannelAsRead = () => {
    if (!selectedChannel) return;
    setChannelAsRead(selectedChannel);
  };

  const goToChatScreen = (channel: ChannelList) => {
    setChannelAsRead(channel);
    if (channel?.channelType === 'ANON_POST_NOTIFICATION') return goToPostDetailScreen(channel);
    navigation.navigate('SampleChatScreen');
    setChat({
      ...chat,
      selectedChannel: channel
    });
    return null;
  };

  const goToPostDetailScreen = (channel: ChannelList) => {
    setChannelAsRead(channel);
    const postNotificationChannel = channel as PostNotificationChannelList;

    if (!postNotificationChannel?.rawJson?.activity_id)
      return SimpleToast.show('Failed to get id', SimpleToast.SHORT);

    return navigation.navigate('PostDetailPage', {
      feedId: postNotificationChannel?.rawJson?.activity_id,
      isCaching: false
    });
  };

  const goBackFromChatScreen = () => {
    navigation.goBack();
    setChat({
      ...chat,
      selectedChannel: null
    });
  };

  const goToChatInfoScreen = () => {
    navigation.navigate('SampleChatInfoScreen');
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    selectedChannel,
    goBack,
    goToChatScreen,
    goToPostDetailScreen,
    goToChatInfoScreen,
    goBackFromChatScreen,
    setSelectedChannelAsRead
  };
}

export default useChatUtilsHook;
