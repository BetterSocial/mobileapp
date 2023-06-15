import SimpleToast from 'react-native-simple-toast';
import {atom, useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';

import UseChatUtilsHook from '../../../../types/hooks/screens/useChatUtilsHook.types';
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
  const navigation = useNavigation();
  const {selectedChannel} = chat;

  const onAnonPostNotification = (channel: ChannelList) => {
    return SimpleToast.show(
      'This is a post notification channel. You cannot chat here.',
      SimpleToast.SHORT
    );
  };

  const goToChatScreen = (channel: ChannelList) => {
    if (channel?.channelType === 'ANON_POST_NOTIFICATION') return onAnonPostNotification(channel);
    navigation.navigate('SampleChatScreen');
    setChat({
      ...chat,
      selectedChannel: channel
    });
    return null;
  };

  const goToPostDetailScreen = (channel: ChannelList) => {
    const postNotificationChannel = channel as PostNotificationChannelList;
    console.log(
      'postNotificationChannel',
      JSON.stringify(postNotificationChannel?.rawJson?.activity_id, null, 2)
    );

    if (!postNotificationChannel?.rawJson?.activity_id)
      return SimpleToast.show('Failed to get id', SimpleToast.SHORT);

    return navigation.navigate('PostDetailPage', {
      feedId: postNotificationChannel?.rawJson?.activity_id,
      // refreshCache: () => handleUpdateCache(item.activity_id, item.totalCommentBadge),
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
    goBackFromChatScreen
  };
}

export default useChatUtilsHook;
