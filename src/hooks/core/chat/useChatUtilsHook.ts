import {atom, useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';

const chatAtom = atom({
  key: 'chatAtom',
  default: {
    selectedChannel: null
  }
});

const useChatUtilsHook = () => {
  const [chat, setChat] = useRecoilState(chatAtom);
  const navigation = useNavigation();
  const {selectedChannel} = chat;

  const goToChatScreen = (channel) => {
    navigation.navigate('SampleChatScreen');
    setChat({
      ...chat,
      selectedChannel: channel
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
    goToChatInfoScreen,
    goBackFromChatScreen
  };
};

export default useChatUtilsHook;
