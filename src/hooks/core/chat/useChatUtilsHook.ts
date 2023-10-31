import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import {atom, useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import UseChatUtilsHook from '../../../../types/hooks/screens/useChatUtilsHook.types';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ChannelList} from '../../../../types/database/schema/ChannelList.types';
import {PostNotificationChannelList} from '../../../../types/database/schema/PostNotificationChannelList.types';
import {ANON_PM, SIGNED} from '../constant';

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

    if (channel?.channelType?.includes('ANON')) {
      AnonymousMessageRepo.setChannelAsRead(channel?.id).catch((e) => {
        console.log('setChannelAsRead error api', e?.response?.data);
      });
    } else {
      //! TODO:
      //! POST TO SIGNED CHAT API & MARK AS READ
    }

    refresh('channelList');
  };

  const helperGoToPostDetailScreen = (channel: ChannelList) => {
    setChannelAsRead(channel);
    const postNotificationChannel = channel as PostNotificationChannelList;

    const isPostNotificationExpired = moment(postNotificationChannel?.expiredAt).isBefore(moment());
    if (isPostNotificationExpired) {
      SimpleToast.show('This post expired and has been removed', SimpleToast.SHORT);
      return refresh('channelList');
    }

    if (!postNotificationChannel?.rawJson?.activity_id)
      return SimpleToast.show('Failed to get id', SimpleToast.SHORT);

    return navigation.navigate('PostDetailPage', {
      feedId: postNotificationChannel?.rawJson?.activity_id,
      isCaching: false
    });
  };

  const goToChatScreen = (channel: ChannelList) => {
    setChannelAsRead(channel);
    if (channel?.channelType?.includes('POST_NOTIFICATION'))
      return helperGoToPostDetailScreen(channel);
    if (channel?.channelType === ANON_PM) {
      navigation.navigate('SampleChatScreen');
    } else {
      navigation.navigate('SignedChatScreen');
    }
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

  const goToChatInfoScreen = (params) => {
    navigation.navigate('SampleChatInfoScreen', params);
  };

  const goBack = () => {
    navigation.goBack();
  };

  return {
    selectedChannel,
    goBack,
    goToChatScreen,
    goToPostDetailScreen: helperGoToPostDetailScreen,
    goToChatInfoScreen,
    goBackFromChatScreen
  };
}

export default useChatUtilsHook;
