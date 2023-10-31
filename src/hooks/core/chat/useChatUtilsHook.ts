import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import {atom, useRecoilState} from 'recoil';
import {useNavigation} from '@react-navigation/native';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import UseChatUtilsHook from '../../../../types/hooks/screens/useChatUtilsHook.types';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ANON_PM} from '../constant';
import {ChannelList} from '../../../../types/database/schema/ChannelList.types';
import {ChannelTypeEnum} from '../../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {PostNotificationChannelList} from '../../../../types/database/schema/PostNotificationChannelList.types';
import {convertTopicNameToTopicPageScreenParam} from '../../../utils/string/StringUtils';

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

  const setChannelAsRead = async (channel: ChannelList) => {
    if (!localDb) return;
    channel.setRead(localDb).catch((e) => console.log('setChannelAsRead error', e));

    if (channel?.channelType?.includes('ANON')) {
      try {
        await AnonymousMessageRepo.setChannelAsRead(channel?.id);
      } catch (error) {
        console.log('setAnonChannelAsRead error api', error);
      }
    } else {
      const channelType = {
        messaging: ChannelTypeEnum.Messaging,
        group: ChannelTypeEnum.Group,
        topics: ChannelTypeEnum.Community
      };

      try {
        await SignedMessageRepo.setChannelAsRead(
          channel?.id,
          channelType[channel?.rawJson?.channel?.type]
        );
      } catch (error) {
        console.log('setSignedChannelAsRead error api', error);
      }
    }

    refresh('channelList');
  };

  const goToPostDetailScreen = (channel: ChannelList) => {
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

  const goToCommunityScreen = (channel: ChannelList) => {
    setChannelAsRead(channel);

    const topicName = channel?.name?.replace(/^#/, '');
    const navigationParam = {
      id: convertTopicNameToTopicPageScreenParam(topicName)
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  const goToChatScreen = (channel: ChannelList) => {
    setChannelAsRead(channel);

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
    goToCommunityScreen,
    goToChatInfoScreen,
    goBackFromChatScreen
  };
}

export default useChatUtilsHook;
