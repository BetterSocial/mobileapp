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

  return {
    selectedChannel,
    goToChatScreen,
    goBackFromChatScreen
  };
};

export default useChatUtilsHook;
