/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react-native-get-random-values';

import * as React from 'react';
import {useMutation} from 'react-query';
import {useRecoilState} from 'recoil';
import {useRoute} from '@react-navigation/core';
import {v4 as uuid} from 'uuid';

import {Platform} from 'react-native';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import UserSchema from '../../database/schema/UserSchema';
import currentChatScreenAtom from '../../atom/currentChatScreenAtom';
import useAnalyticUtilsHook from '../../libraries/analytics/useAnalyticUtilsHook';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useDatabaseQueueHook from '../core/queue/useDatabaseQueueHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import ImageUtils, {UploadOptions} from '../../utils/image';
import UseChatScreenHook, {
  GoToChatInfoScreenByTrigger
} from '../../../types/hooks/screens/useChatScreenHook.types';
import {BetterSocialEventTracking} from '../../libraries/analytics/analyticsEventTracking';
import {CHANNEL_TYPE_GROUP, CHANNEL_TYPE_PERSONAL} from '../../utils/constants';
import {DatabaseOperationLabel} from '../../core/queue/DatabaseQueue';
import {QueueJobPriority} from '../../core/queue/BaseQueue';
import {getAnonymousUserId, getUserId} from '../../utils/users';
import {randomString} from '../../utils/string/StringUtils';
import {useGetAllMessage} from './services/chatScreenHooks';
import {useSendAnonMessage, useSendSignedMessage} from '../../service/chat';

interface ScrollContextProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  handleScrollTo: (id: string) => void;
}
export const ScrollContext = React.createContext<ScrollContextProps | null>(null);

function useChatScreenHook(type: 'SIGNED' | 'ANONYMOUS'): UseChatScreenHook {
  const {localDb, refresh, otherListener} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen, setChannelAsRead} =
    useChatUtilsHook(type);
  const {anonProfileId, signedProfileId} = useUserAuthHook();
  const {queue} = useDatabaseQueueHook();
  const {eventTrackByUserType, getEventName} = useAnalyticUtilsHook(type);
  const [, setCurrentChatScreen] = useRecoilState(currentChatScreenAtom);

  const {params} = useRoute();

  const [selfAnonUserInfo, setSelfAnonUserInfo] = React.useState<any>(null);
  const [chats, setChats] = React.useState<ChatSchema[]>(params?.initialMessages || []);
  const [isLoadingFetchAllMessage, setIsLoadingFetchAllMessage] = React.useState(false);

  const sendChatSignedMutation = useSendSignedMessage();
  const sendChatAnonMutation = useSendAnonMessage();

  const uploadMediaFailedEvent: UploadOptions = {
    withFailedEventTrack: getEventName(
      BetterSocialEventTracking.SIGNED_CHAT_SCREEN_ATTACHMENT_MEDIA_UPLOAD_FILE,
      BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_ATTACHMENT_MEDIA_UPLOAD_FILE
    )
  };

  const getAllMessages = useGetAllMessage(
    {
      localDb,
      selectedChannelId: selectedChannel?.id,
      signedProfileId,
      anonProfileId
    },
    {
      enabled: !!localDb && !!selectedChannel && !!otherListener[`chat_${selectedChannel?.id}`]
    }
  );

  const initChatData = async () => {
    if (!localDb || !selectedChannel) return;
    if (!otherListener[`chat_${selectedChannel?.id}`]) return;

    try {
      if (Platform.OS === 'android') {
        setChannelAsRead(selectedChannel, true);
        getAllMessages.refetch();
      } else {
        queue.addPriorityJob({
          priority: QueueJobPriority.HIGH,
          operationLabel: DatabaseOperationLabel.ChatScreen_GetChat,
          id: selectedChannel?.name,
          task: async () => {
            setChannelAsRead(selectedChannel, true);
            getAllMessages.refetch();
          }
        });
      }

      if (type === 'ANONYMOUS') {
        if (Platform.OS === 'android') {
          const userInfo = await UserSchema.getSelfAnonUserInfo(
            localDb,
            anonProfileId,
            selectedChannel?.id
          );
          setSelfAnonUserInfo(userInfo);
        } else {
          queue.addPriorityJob({
            priority: QueueJobPriority.MEDIUM,
            operationLabel: DatabaseOperationLabel.ChatScreen_GetSelfAnonUserInfo,
            id: selectedChannel?.name,
            task: async () => {
              const userInfo = await UserSchema.getSelfAnonUserInfo(
                localDb,
                anonProfileId,
                selectedChannel?.id
              );
              setSelfAnonUserInfo(userInfo);
            }
          });
        }
      }
    } catch (e) {
      console.log(e, 'error get all chat');
    }
  };

  const processImageAttachment = async (item) => {
    const uploadedImageUrl = await ImageUtils.uploadImage(item.asset_url, uploadMediaFailedEvent);
    return {...item, asset_url: uploadedImageUrl.data.url, thumb_url: uploadedImageUrl.data.url};
  };

  const processVideoAttachment = async (item) => {
    const uploadedImageUrl = await ImageUtils.uploadImage(item.asset_url, uploadMediaFailedEvent);
    const uploadedUrl = await ImageUtils.uploadFile(
      item.video_path,
      item.video_name,
      item.video_type,
      uploadMediaFailedEvent
    );
    return {
      ...item,
      asset_url: uploadedImageUrl.data.url,
      thumb_url: uploadedImageUrl.data.url,
      video_path: uploadedUrl.data.url
    };
  };

  const processFileAttachment = async (item) => {
    const uploadedUrl = await ImageUtils.uploadFile(
      item.file_path,
      item.file_name,
      item.file_type,
      uploadMediaFailedEvent
    );
    return {
      ...item,
      asset_url: uploadedUrl.data.url,
      thumb_url: uploadedUrl.data.url,
      file_path: uploadedUrl.data.url
    };
  };

  const processAttachments = async (attachments) => {
    const attachmentPromises = attachments.map(async (item) => {
      switch (item.type) {
        case 'image':
          return processImageAttachment(item);
        case 'video':
          return processVideoAttachment(item);
        case 'file':
          return processFileAttachment(item);
        default:
          return item;
      }
    });

    return Promise.all(attachmentPromises);
  };

  const sendChat = async (props: {
    message: string;
    attachments: Array<any>;
    iteration: number;
    sendingChatSchema: ChatSchema | null;
  }) => {
    const {message = randomString(20), attachments = [], sendingChatSchema = null} = props;
    let currentChatSchema = sendingChatSchema;
    let userId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();

    if (type === 'ANONYMOUS') {
      userId = myAnonymousId;
    }

    try {
      const randomId = uuid();

      if (currentChatSchema === null) {
        if (Platform.OS === 'android') {
          currentChatSchema = await ChatSchema.generateSendingChat(
            randomId,
            userId,
            selectedChannel?.id || '',
            message,
            attachments,
            localDb,
            'regular',
            'pending'
          );

          await currentChatSchema?.save(localDb);
          initChatData();
        } else {
          queue.addPriorityJob({
            operationLabel: DatabaseOperationLabel.ChatScreen_SendChat,
            id: `${selectedChannel?.id}-${new Date().valueOf()}`,
            priority: QueueJobPriority.HIGH,
            forceAddToQueue: true,
            task: async () => {
              currentChatSchema = await ChatSchema.generateSendingChat(
                randomId,
                userId,
                selectedChannel?.id || '',
                message,
                attachments,
                localDb,
                'regular',
                'pending'
              );

              await currentChatSchema?.save(localDb);
              initChatData();
            }
          });
        }

        if (selectedChannel) {
          if (Platform.OS === 'android') {
            const channelList: ChannelList | null = await ChannelList.getSchemaById(
              localDb,
              selectedChannel?.id
            );
            if (channelList) {
              channelList.description = message;
              channelList.lastUpdatedBy = userId;
              channelList.lastUpdatedAt = new Date().toISOString();
              await channelList.save(localDb);
              refresh('channelList');
            }
          } else {
            queue.addPriorityJob({
              operationLabel: DatabaseOperationLabel.ChatScreen_UpdateChannelDescription,
              id: `${selectedChannel?.id}-${randomId}`,
              priority: QueueJobPriority.HIGH,
              task: async () => {
                const channelList: ChannelList | null = await ChannelList.getSchemaById(
                  localDb,
                  selectedChannel?.id
                );
                if (channelList) {
                  channelList.description = message;
                  channelList.lastUpdatedBy = userId;
                  channelList.lastUpdatedAt = new Date().toISOString();
                  await channelList.save(localDb);
                  refresh('channelList');
                }
              }
            });
          }
        }
      }

      const channelType =
        selectedChannel?.channelType === 'GROUP' ? CHANNEL_TYPE_GROUP : CHANNEL_TYPE_PERSONAL;

      const newAttachments = await processAttachments(attachments);

      let response;
      if (type === 'ANONYMOUS') {
        response = await sendChatAnonMutation.mutateAsync({
          channelId: selectedChannel?.id,
          message,
          attachments: newAttachments,
          replyMessageId: null
        } as any);
      } else {
        response = await sendChatSignedMutation.mutateAsync({
          channelId: selectedChannel?.id,
          message,
          channelType,
          attachments: newAttachments,
          replyMessageId: null
        } as any);
      }
      if (Platform.OS === 'android') {
        await currentChatSchema?.updateChatSentStatus(localDb, response);
        initChatData();
        refresh('channelList');
      } else {
        queue.addPriorityJob({
          operationLabel: DatabaseOperationLabel.ChatScreen_UpdateChatSentStatus,
          id: `${selectedChannel?.id}-${randomId}`,
          priority: QueueJobPriority.HIGH,
          forceAddToQueue: true,
          task: async () => {
            await currentChatSchema?.updateChatSentStatus(localDb, response);
            initChatData();
            refresh('channelList');
          }
        });
      }
    } catch (e) {
      console.log('[ERROR] error sending chat', e);
      // if (e?.response?.data?.status === 'Channel is blocked') return;
    }
  };

  const sendChatMutation = useMutation(sendChat, {
    retry: 10,
    retryDelay: 1000
  });

  const updateChatContinuity = (chatsData: ChatSchema[]) => {
    const updatedChat = chatsData
      .map((currentChat, currentIndex) => {
        const previousChat = chatsData[currentIndex + 1];

        if (previousChat) {
          if (
            currentChat?.userId === previousChat?.userId &&
            (previousChat?.rawJson?.isSystem ||
              previousChat?.rawJson?.type === 'system' ||
              previousChat?.rawJson?.message?.type === 'system')
          ) {
            currentChat.isContinuous = false;
          }
        }
        // remove current same system message between previous and current chat
        if (
          (previousChat?.rawJson?.isSystem ||
            previousChat?.rawJson?.type === 'system' ||
            previousChat?.rawJson?.message?.type === 'system') &&
          previousChat?.message === currentChat.message
        ) {
          return null;
        }
        return currentChat;
      })
      .filter((i) => i != null);

    return updatedChat;
  };

  const goBackToChatTab = () => {
    eventTrackByUserType(
      BetterSocialEventTracking.SIGNED_CHAT_SCREEN_HEADER_BACK_BUTTON_CLICKED,
      BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_HEADER_BACK_BUTTON_CLICKED
    );
    goBackFromChatScreen();
  };

  const goToChatInfoScreenBy = (
    trigger: GoToChatInfoScreenByTrigger,
    goToChatInfoScreenParams?: any
  ) => {
    goToChatInfoScreen(goToChatInfoScreenParams);
    if (trigger === 'ProfilePicture')
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_HEADER_PROFILE_PICTURE_CLICKED,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_HEADER_PROFILE_PICTURE_CLICKED
      );
    else if (trigger === 'OptionsButton') {
      eventTrackByUserType(
        BetterSocialEventTracking.SIGNED_CHAT_SCREEN_HEADER_OPTIONS_BUTTON_CLICKED,
        BetterSocialEventTracking.ANONYMOUS_CHAT_SCREEN_HEADER_OPTIONS_BUTTON_CLICKED
      );
    }
  };

  React.useEffect(() => {
    if (localDb && selectedChannel) {
      initChatData();
    }
  }, [localDb, otherListener[`chat_${selectedChannel?.id}`], selectedChannel]);

  React.useEffect(() => {
    setCurrentChatScreen(type === 'SIGNED' ? 'SignedChatScreen' : 'AnonymousChatScreen');
    return () => {
      setChats([]);
      setCurrentChatScreen(null);
    };
  }, []);

  React.useEffect(() => {
    if (getAllMessages.data) {
      setChats(getAllMessages.data);
      setIsLoadingFetchAllMessage(false);
    }
  }, [getAllMessages.data]);

  return {
    chats,
    selectedChannel,
    selfAnonUserInfo,
    isLoadingFetchAllMessage,
    goBackFromChatScreen,
    goBackToChatTab,
    goToChatInfoScreen,
    goToChatInfoScreenBy,
    sendChat,
    updateChatContinuity,
    sendChatMutation
  };
}

export default useChatScreenHook;
