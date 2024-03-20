/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react-native-get-random-values';

import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import ImageUtils from '../../utils/image';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UseChatScreenHook from '../../../types/hooks/screens/useChatScreenHook.types';
import UserSchema from '../../database/schema/UserSchema';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useDatabaseQueueHook from '../core/queue/useDatabaseQueueHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../core/auth/useUserAuthHook';
import {CHANNEL_TYPE_GROUP, CHANNEL_TYPE_PERSONAL} from '../../utils/constants';
import {ENV} from '../../libraries/Configs/ENVConfig';
import {JobPriority} from '../../core/queue/BaseQueue';
import {getAnonymousUserId, getUserId} from '../../utils/users';
import {getOfficialAnonUsername, randomString} from '../../utils/string/StringUtils';

interface ScrollContextProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  handleScrollTo: (id: string) => void;
}
export const ScrollContext = React.createContext<ScrollContextProps | null>(null);

function useChatScreenHook(type: 'SIGNED' | 'ANONYMOUS'): UseChatScreenHook {
  const {localDb, refresh, otherListener, refreshWithId, chat} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen} = useChatUtilsHook(type);
  const {anonProfileId} = useUserAuthHook();
  const {queue} = useDatabaseQueueHook();
  // const queue = DatabaseQueue.getInstance();

  const isInitiatingChatRef = React.useRef(false);

  const [selfAnonUserInfo, setSelfAnonUserInfo] = React.useState<any>(null);
  const [chats, setChats] = React.useState<ChatSchema[]>([]);
  const initChatData = async () => {
    if (!localDb || !selectedChannel) return;
    const chatListener = otherListener[`chat_${selectedChannel?.id}`];
    if (!chatListener) return;
    // console.log('checkpoint chat screen 1');

    try {
      isInitiatingChatRef.current = true;
      const myUserId = await getUserId();
      const myAnonymousId = await getAnonymousUserId();
      const time = new Date().getTime();

      queue.addHighPriorityJob({
        priority: JobPriority.HIGH,
        label: `get-all-chat-${selectedChannel?.name}`,
        task: async () => {
          const data = (await ChatSchema.getAll(
            localDb,
            selectedChannel?.id,
            myUserId,
            myAnonymousId
          )) as ChatSchema[];
          if (ENV === 'Dev') {
            SimpleToast.show(
              `checkpoint finish getting all chat data: ${(new Date().getTime() - time) / 1000}s`
            );
          }
          setChats(data);
          isInitiatingChatRef.current = false;

          return data;
        }
      });

      if (type === 'ANONYMOUS') {
        queue.addHighPriorityJob({
          priority: JobPriority.MEDIUM,
          label: `get-anon-user-info-${selectedChannel?.name}`,
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
    } catch (e) {
      isInitiatingChatRef.current = false;
      console.log(e, 'error get all chat');
    }
  };

  const processImageAttachment = async (item) => {
    const uploadedImageUrl = await ImageUtils.uploadImage(item.asset_url);
    return {...item, asset_url: uploadedImageUrl.data.url, thumb_url: uploadedImageUrl.data.url};
  };

  const processVideoAttachment = async (item) => {
    const uploadedImageUrl = await ImageUtils.uploadImage(item.asset_url);
    const uploadedUrl = await ImageUtils.uploadFile(
      item.video_path,
      item.video_name,
      item.video_type
    );
    return {
      ...item,
      asset_url: uploadedImageUrl.data.url,
      thumb_url: uploadedImageUrl.data.url,
      video_path: uploadedUrl.data.url
    };
  };

  const processFileAttachment = async (item) => {
    const uploadedUrl = await ImageUtils.uploadFile(item.file_path, item.file_name, item.file_type);
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

  const sendChat = async (
    message: string = randomString(20),
    attachments: [] = [],
    iteration = 0,
    sendingChatSchema: ChatSchema | null = null
  ) => {
    const MAX_ITERATIONS = 5;

    if (iteration > MAX_ITERATIONS) {
      SimpleToast.show("Can't send message, please check your connection");
      return;
    }

    let currentChatSchema = sendingChatSchema;
    let userId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();

    if (type === 'ANONYMOUS') {
      userId = myAnonymousId;
    }

    try {
      const randomId = uuid();

      if (currentChatSchema === null) {
        currentChatSchema = await ChatSchema.generateSendingChat(
          randomId,
          userId,
          selectedChannel?.id,
          message,
          attachments,
          localDb,
          'regular',
          'pending'
        );
        currentChatSchema.save(localDb);
        if (selectedChannel) {
          const channelList: ChannelList | null = await ChannelList.getSchemaById(
            localDb,
            selectedChannel?.id
          );
          if (channelList) {
            channelList.description = message;
            channelList.lastUpdatedBy = userId;
            channelList.lastUpdatedAt = new Date().toISOString();
            await channelList.save(localDb);
          }
        }

        refreshWithId('chat', selectedChannel?.id);
        // refresh('chat');
        refresh('channelList');
      }

      const channelType =
        selectedChannel?.channelType === 'GROUP' ? CHANNEL_TYPE_GROUP : CHANNEL_TYPE_PERSONAL;

      const newAttachments = await processAttachments(attachments);

      let response;
      if (type === 'ANONYMOUS') {
        response = await AnonymousMessageRepo.sendAnonymousMessage(
          selectedChannel?.id,
          message,
          newAttachments,
          null
        );
      } else {
        response = await SignedMessageRepo.sendSignedMessage(
          selectedChannel?.id,
          message,
          channelType,
          newAttachments,
          null
        );
      }

      await currentChatSchema.updateChatSentStatus(localDb, response);
      refreshWithId('chat', selectedChannel?.id);
      // refresh('chat');
      refresh('channelList');
    } catch (e) {
      if (e?.response?.data?.status === 'Channel is blocked') return;

      setTimeout(async () => {
        await sendChat(message, attachments, iteration + 1, currentChatSchema);
      }, 1000);
    }
  };

  const handleUserName = (item): string => {
    if (item?.user?.anon_user_info_emoji_code) {
      return getOfficialAnonUsername(item?.user);
    }

    if (item?.user?.username !== 'AnonymousUser') {
      return item?.user?.username;
    }

    return getOfficialAnonUsername(selectedChannel);
  };

  const updateChatContinuity = (chatsData: ChatSchema[]) => {
    const updatedChats = chatsData.map((currentChat, currentIndex) => {
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
      return currentChat;
    });

    return updatedChats;
  };

  React.useEffect(() => {
    initChatData();
  }, [localDb, chat, otherListener[`chat_${selectedChannel?.id}`], selectedChannel]);

  return {
    chats,
    selectedChannel,
    selfAnonUserInfo,

    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat,
    handleUserName,
    updateChatContinuity
  };
}

export default useChatScreenHook;
