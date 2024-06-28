import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import moment from 'moment';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {CommonActions, useNavigation} from '@react-navigation/native';
import {atom, useRecoilState} from 'recoil';

import AnonymousMessageRepo from '../../../service/repo/anonymousMessageRepo';
import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import SignedMessageRepo from '../../../service/repo/signedMessageRepo';
import UserSchema from '../../../database/schema/UserSchema';
import useDatabaseQueueHook from '../queue/useDatabaseQueueHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../auth/useUserAuthHook';
import UseChatUtilsHook, {
  ContactScreenPayload
} from '../../../../types/hooks/screens/useChatUtilsHook.types';
import {ANON_PM, GROUP_INFO} from '../constant';
import {
  BetterSocialChannelType,
  GoToChatScreenOptionalParams
} from '../../../../types/database/schema/ChannelList.types';
import {ChannelTypeEnum} from '../../../../types/repo/SignedMessageRepo/SignedPostNotificationData';
import {Context} from '../../../context';
import {DatabaseOperationLabel} from '../../../core/queue/DatabaseQueue';
import {PostNotificationChannelList} from '../../../../types/database/schema/PostNotificationChannelList.types';
import {QueueJobPriority} from '../../../core/queue/BaseQueue';
import {
  convertTopicNameToTopicPageScreenParam,
  getChannelListInfo
} from '../../../utils/string/StringUtils';

const chatAtom = atom({
  key: 'chatAtom',
  default: {
    selectedChannel: null,
    isLoadingFetchingChannelDetail: false
  }
});

const selectedChannelKeyTab = atom({
  key: 'selectedChannelKeyTab',
  default: 0
});

function useChatUtilsHook(type: 'SIGNED' | 'ANONYMOUS'): UseChatUtilsHook {
  const [chat, setChat] = useRecoilState(chatAtom);
  const {selectedChannel, isLoadingFetchingChannelDetail} = chat;

  const [selectedChannelKey, setSelectedChannelKey] = useRecoilState(selectedChannelKeyTab);

  const {localDb, refresh, refreshWithId} = useLocalDatabaseHook();
  const navigation = useNavigation();
  const [profile] = (React.useContext(Context) as unknown as any).profile;
  const {anonProfileId, signedProfileId} = useUserAuthHook();
  const {queue} = useDatabaseQueueHook();

  const setChannelAsRead = async (
    channel: ChannelList,
    ignoreRefresh: boolean | undefined = false
  ) => {
    if (!localDb) return;
    channel.setRead(localDb).catch((e) => console.log('setChannelAsRead error', e));

    if (channel?.channelType?.includes('ANON')) {
      try {
        AnonymousMessageRepo.setChannelAsRead(channel?.id?.replace('_anon', ''));
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
        SignedMessageRepo.setChannelAsRead(
          channel?.id,
          channelType[channel?.rawJson?.channel?.type]
        );
      } catch (error) {
        console.log('setSignedChannelAsRead error api', error);
      }
    }

    refresh('channelList');

    if (ignoreRefresh) return;

    refresh('channelInfo');
    refresh('user');
    refreshWithId('chat', channel?.id);
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

  const openChat = (screen: string, from?: string) => {
    navigation.dispatch({
      ...CommonActions.reset({
        routes: [
          {
            name: 'AuthenticatedStack',
            params: {
              screen: 'HomeTabs',
              params: {
                screen: from ?? 'ChannelList',
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

  const helperSaveChannelDetail = async (channel: ChannelList, response: any) => {
    if (!localDb) return;

    queue.addPriorityJob({
      operationLabel: DatabaseOperationLabel.FetchChannelDetail_SaveAllChat,
      id: channel?.id,
      priority: QueueJobPriority.MEDIUM,
      task: async () => {
        const saveChatPromises = response?.messages?.map((message) => {
          return new Promise((resolve) => {
            // Skip if message_type is notification-deleted
            if (message?.message_type === 'notification-deleted') return resolve(true);

            const chatMessage = ChatSchema.fromGetAllChannelAPI(channel?.id, message);
            chatMessage.save(localDb);
            resolve(true);
          });
        });

        await Promise.all(saveChatPromises);
      }
    });

    queue.addPriorityJob({
      operationLabel: DatabaseOperationLabel.FetchChannelDetail_RefreshChannelList,
      id: channel?.id,
      priority: QueueJobPriority.LOW,
      task: async () => {
        refresh('channelList');
      },
      forceAddToQueue: true
    });

    const builtChannelData = {
      better_channel_member: response?.better_channel_members,
      members: response?.members
    };
    const {
      originalMembers,
      anonUserInfoColorCode,
      anonUserInfoColorName,
      anonUserInfoEmojiCode,
      anonUserInfoEmojiName,
      channelImage,
      channelName
    } = getChannelListInfo(builtChannelData, signedProfileId, anonProfileId);

    const channelData = await ChannelList.getSchemaById(localDb, channel?.id);

    if (channelData !== null) {
      channelData.anon_user_info_color_code = anonUserInfoColorCode;
      channelData.anon_user_info_color_name = anonUserInfoColorName;
      channelData.anon_user_info_emoji_code = anonUserInfoEmojiCode;
      channelData.anon_user_info_emoji_name = anonUserInfoEmojiName;
      channelData.channelPicture = channelImage;
      channelData.name = channelName;

      queue.addPriorityJob({
        operationLabel: DatabaseOperationLabel.FetchChannelDetail_SaveChannelList,
        id: channel?.id,
        priority: QueueJobPriority.MEDIUM,
        task: async () => {
          channelData.saveIfLatest(localDb);
        }
      });
    }

    originalMembers?.map((member) => {
      const user = UserSchema.fromMemberWebsocketObject(member, channel?.id);
      try {
        queue.addPriorityJob({
          operationLabel: DatabaseOperationLabel.FetchChannelDetail_SaveUserMember,
          id: `${channel?.name}-${member?.user?.username}`,
          priority: QueueJobPriority.MEDIUM,
          task: async () => {
            user.saveOrUpdateIfExists(localDb);
          }
        });
      } catch (e) {
        console.log('error on save user from channel detail fetch', e);
      }

      return null;
    });
  };

  const helperGetChannelDetail = async (channel: ChannelList) => {
    if (!localDb) return;

    try {
      let response;
      if (channel?.channelType === 'ANON_PM') {
        response = await AnonymousMessageRepo.getAnonymousChannelDetail('messaging', channel?.id);
      } else {
        const channelType = channel?.channelType === 'GROUP' ? 'group' : 'messaging';
        response = await SignedMessageRepo.getSignedChannelDetail(channelType, channel?.id);
      }
      helperSaveChannelDetail(channel, response);
    } catch (e) {
      console.log('getChannelDetail error', e);
    } finally {
      setChat((prevChat) => ({
        ...prevChat,
        isLoadingFetchingChannelDetail: false
      }));
      refresh('channelInfo');
      refresh('channelList');
      refreshWithId('chat', channel?.id);
    }
  };

  const goToChatScreen = (
    channel: ChannelList,
    from?: AllowedGoToChatScreen,
    optionalParams?: GoToChatScreenOptionalParams
  ) => {
    setChannelAsRead(channel);

    const {initialMessages = []} = optionalParams || {};

    const isChannelTypeChat: (BetterSocialChannelType | undefined)[] = ['ANON_PM', 'GROUP', 'PM'];
    const isChat = isChannelTypeChat.includes(channel?.channelType);

    if (isChat) {
      helperGetChannelDetail(channel);
    }

    setChat({
      isLoadingFetchingChannelDetail: isChat,
      selectedChannel: channel
    });

    if (from === 'CONTACT_SCREEN') {
      return openChat(
        'SignedChatScreen',
        channel?.channelType === ANON_PM ? 'AnonymousChannelList' : 'ChannelList'
      );
    }

    if (channel?.channelType === ANON_PM) {
      if (from === GROUP_INFO) {
        return openChat('AnonymousChatScreen', 'AnonymousChannelList');
      }
      setTimeout(
        () =>
          navigation.navigate('AnonymousChatScreen', {
            initialMessages
          }),
        10
      );
    } else {
      if (from === GROUP_INFO) {
        return openChat('SignedChatScreen', 'SignedChannelList');
      }
      setTimeout(() => navigation.navigate('SignedChatScreen', {initialMessages}), 10);
    }

    return null;
  };

  const goToMoveChat = (channel: ChannelList) => {
    setChat((prevChat) => ({
      ...prevChat,
      selectedChannel: channel
    }));
    setChannelAsRead(channel);
    if (channel?.channelType === ANON_PM) {
      setSelectedChannelKey(1);
      return openChat('AnonymousChatScreen');
    }
    setSelectedChannelKey(0);
    return openChat('SignedChatScreen');
  };

  const goBackFromChatScreen = async () => {
    if (type === 'ANONYMOUS') {
      navigation.navigate('AnonymousChannelList');
    }
    if (type === 'SIGNED') {
      navigation.navigate('SignedChannelList');
    }
    setChat((prevChat) => ({
      ...prevChat,
      selectedChannel: null
    }));
  };

  const goToContactScreen = ({from}: ContactScreenPayload) => {
    navigation.navigate('ContactScreen', {from});
  };

  const goToChatInfoScreen = (params?: object) => {
    navigation.navigate('ChatInfoScreen', params);
  };

  const goBack = () => {
    navigation.goBack();
  };
  const handleTextSystem = (item): string => {
    if (profile?.myProfile?.user_id && item.rawJson) {
      if (
        item?.rawJson?.userIdFollower === profile?.myProfile?.user_id ||
        item?.rawJson?.message?.userIdFollower === profile?.myProfile?.user_id
      ) {
        return item?.rawJson?.textOwnMessage || item?.rawJson?.message?.textOwnMessage;
      }
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

  const setSelectedChannel = (channel: ChannelList) => {
    setChat((prevChat) => ({
      ...prevChat,
      selectedChannel: channel,
      isLoadingFetchingChannelDetail: false
    }));
  };

  return {
    isLoadingFetchingChannelDetail,
    selectedChannel,
    selectedChannelKey,
    fetchChannelDetail: helperGetChannelDetail,
    goBack,
    goToChatScreen,
    goToMoveChat,
    goToPostDetailScreen,
    goToCommunityScreen,
    goToContactScreen,
    goToChatInfoScreen,
    goBackFromChatScreen,
    handleTextSystem,
    setSelectedChannel,
    setChannelAsRead,
    splitSystemMessage
  };
}

export default useChatUtilsHook;

export type AllowedGoToChatScreen =
  | 'CONTACT_SCREEN'
  | 'PROFILE_SCREEN'
  | 'CHAT_DETAIL_SCREEN'
  | 'GROUP_INFO';
