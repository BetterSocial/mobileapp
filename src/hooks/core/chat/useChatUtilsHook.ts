import SimpleToast from 'react-native-simple-toast';
import {atom, useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';

import ChannelList from '../../../database/schema/ChannelListSchema';
import UseChatUtilsHook from '../../../../types/hooks/screens/useChatUtilsHook.types';

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
    goToChatInfoScreen,
    goBackFromChatScreen
  };
}

export default useChatUtilsHook;
