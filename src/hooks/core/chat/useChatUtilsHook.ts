import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
import {atom, useRecoilState} from 'recoil';
import {useNavigation, CommonActions} from '@react-navigation/native';
import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import UseChatUtilsHook from '../../../../types/hooks/screens/useChatUtilsHook.types';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ANON_PM, GROUP_INFO} from '../constant';
import {ChannelList} from '../../../../types/database/schema/ChannelList.types';
import {ChannelTypeEnum} from '../../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {Context} from '../../../context';
import {PostNotificationChannelList} from '../../../../types/database/schema/PostNotificationChannelList.types';
import {convertTopicNameToTopicPageScreenParam} from '../../../utils/string/StringUtils';

const chatAtom = atom({
  key: 'chatAtom',
  default: {
    selectedChannel: null
  }
});

const selectedChannelKeyTab = atom({
  key: 'selectedChannelKeyTab',
  default: 0
});

function useChatUtilsHook(): UseChatUtilsHook {
  const [chat, setChat] = useRecoilState(chatAtom);
  const [selectedChannelKey, setSelectedChannelKey] = useRecoilState(selectedChannelKeyTab);
  const {localDb, refresh} = useLocalDatabaseHook();
  const navigation = useNavigation();
  const {selectedChannel} = chat;
  const [profile] = (React.useContext(Context) as any).profile;
  const setChannelAsRead = async (channel: ChannelList) => {
    if (!localDb) return;
    channel.setRead(localDb).catch((e) => console.log('setChannelAsRead error', e));

    if (channel?.channelType?.includes('ANON')) {
      try {
        await AnonymousMessageRepo.setChannelAsRead(channel?.id?.replace('_anon', ''));
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
      id: convertTopicNameToTopicPageScreenParam(topicName),
      channelPicture: channel.channelPicture,
      coverImage: channel.rawJson.cover_image,
      isFollowing: channel.rawJson.is_following,
      memberCount: channel.rawJson.member_count
    };

    navigation.navigate('TopicPageScreen', navigationParam);
  };

  const openChat = (screen: string) => {
    navigation.dispatch({
      ...CommonActions.reset({
        routes: [
          {
            name: 'AuthenticatedStack',
            params: {
              screen: 'HomeTabs',
              params: {
                screen: 'ChannelList',
                isReset: true
              }
            }
          },
          {
            name: 'AuthenticatedStack',
            params: {
              screen,
              isReset: true
            }
          }
        ]
      })
    });
  };

  const goToChatScreen = (channel: ChannelList, from) => {
    setChat({
      ...chat,
      selectedChannel: channel as unknown as null
    });
    setChannelAsRead(channel);
    if (channel?.channelType === ANON_PM) {
      if (from === GROUP_INFO) {
        return openChat('SampleChatScreen');
      }
      navigation.navigate('SampleChatScreen');
    } else {
      if (from === GROUP_INFO) {
        return openChat('SignedChatScreen');
      }
      navigation.navigate('SignedChatScreen');
    }

    return null;
  };

  const goToMoveChat = (channel: ChannelList) => {
    setChat({
      ...chat,
      selectedChannel: channel
    });
    setChannelAsRead(channel);
    if (channel?.channelType === ANON_PM) {
      setSelectedChannelKey(1);
      return openChat('SampleChatScreen');
    }
    setSelectedChannelKey(0);
    return openChat('SignedChatScreen');
  };

  const goBackFromChatScreen = async () => {
    navigation.goBack();
    setChat({
      ...chat,
      selectedChannel: null
    });
  };

  const goToChatInfoScreen = (params?: object) => {
    navigation.navigate('SampleChatInfoScreen', params);
  };

  const goBack = () => {
    navigation.goBack();
  };
  const handleTextSystem = (item): string => {
    if (
      item?.rawJson?.userIdFollower === profile?.myProfile?.user_id ||
      item?.rawJson?.message?.userIdFollower === profile?.myProfile?.user_id
    ) {
      return item?.rawJson?.textOwnMessage || item?.rawJson?.message?.textOwnMessage;
    }
    return item?.description || item?.message;
  };

  const splitSystemMessage = (message: string): string[] => {
    const splitMessage = message?.split('.');
    const pushMessage: string[] = [];
    splitMessage?.forEach((systemMessage) => {
      if (systemMessage && systemMessage.length > 0) {
        const arrMessage: string = systemMessage?.trimStart()?.replace(/\n/g, '');
        pushMessage.push(arrMessage);
      }
    });
    return pushMessage;
  };

  return {
    selectedChannel,
    selectedChannelKey,
    goBack,
    goToChatScreen,
    goToMoveChat,
    goToPostDetailScreen,
    goToCommunityScreen,
    goToChatInfoScreen,
    goBackFromChatScreen,
    handleTextSystem,
    splitSystemMessage
  };
}

export default useChatUtilsHook;
