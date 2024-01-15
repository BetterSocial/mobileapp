/* eslint-disable @typescript-eslint/no-explicit-any */
import 'react-native-get-random-values';

import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChatSchema from '../../database/schema/ChatSchema';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UseChatScreenHook from '../../../types/hooks/screens/useChatScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {
  CHANNEL_TYPE_ANONYMOUS,
  CHANNEL_TYPE_GROUP,
  CHANNEL_TYPE_PERSONAL
} from '../../utils/constants';
import {getAnonymousUserId, getUserId} from '../../utils/users';
import {randomString} from '../../utils/string/StringUtils';
import ImageUtils from '../../utils/image';

interface ScrollContextProps {
  selectedMessageId: string | null;
  setSelectedMessageId: (id: string | null) => void;
  handleScrollTo: (id: string) => void;
}
export const ScrollContext = React.createContext<ScrollContextProps | null>(null);

function useChatScreenHook(type: 'SIGNED' | 'ANONYMOUS'): UseChatScreenHook {
  const {localDb, chat, refresh} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen} = useChatUtilsHook();

  const [chats, setChats] = React.useState<ChatSchema[]>([]);
  const {anon_user_info_emoji_name} = selectedChannel?.rawJson?.channel || {};
  const initChatData = async () => {
    if (!localDb || !selectedChannel) return;
    try {
      const myUserId = await getUserId();
      const myAnonymousId = await getAnonymousUserId();
      const data = (await ChatSchema.getAll(
        localDb,
        selectedChannel?.id,
        myUserId,
        myAnonymousId
      )) as ChatSchema[];
      setChats(data);
    } catch (e) {
      console.log(e, 'error get all chat');
    }
  };

  const sendChat = async (
    message: string = randomString(20),
    attachments: [],
    iteration = 0,
    sendingChatSchema: ChatSchema | null = null
  ) => {
    if (iteration > 5) {
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
        refresh('chat');
        refresh('channelList');
      }
      let channelType = CHANNEL_TYPE_PERSONAL;
      if (
        selectedChannel?.channelType?.toLowerCase() === 'group' ||
        selectedChannel?.rawJson?.channel?.type === 'group'
      ) {
        channelType = CHANNEL_TYPE_GROUP;
      }

      if (selectedChannel?.rawJson?.channel?.channel_type === 4) {
        channelType = CHANNEL_TYPE_ANONYMOUS;
      }

      let response;

      const allAttachmentPromises: Promise<void>[] = attachments.map(async (item: any) => {
        if (item.type === 'image') {
          const uploadedImageUrl = await ImageUtils.uploadImage(item.asset_url);
          return {
            ...item,
            asset_url: uploadedImageUrl.data.url,
            thumb_url: uploadedImageUrl.data.url
          };
        }
        if (item.type === 'video') {
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
        }
        if (item.type === 'file') {
          const uploadedUrl = await ImageUtils.uploadFile(
            item.file_path,
            item.file_name,
            item.file_type
          );
          return {
            ...item,
            asset_url: uploadedUrl.data.url,
            thumb_url: uploadedUrl.data.url,
            file_path: uploadedUrl.data.url
          };
        }

        return item;
      });

      const newAttachments = await Promise.all(allAttachmentPromises);

      if (type === ANONYMOUS) {
        response = await AnonymousMessageRepo.sendAnonymousMessage(
          selectedChannel?.id,
          message,
          newAttachments,
          replyData?.id
        );
      } else {
        response = await SignedMessageRepo.sendSignedMessage(
          selectedChannel?.id,
          message,
          channelType,
          newAttachments,
          replyData?.id
        );
      }
      await currentChatSchema.updateChatSentStatus(localDb, response);
      refresh('chat');
      refresh('channelList');
    } catch (e) {
      if (e?.response?.data?.status === 'Channel is blocked') return;

      setTimeout(() => {
        sendChat(message, attachments, iteration + 1, currentChatSchema).catch((sendChatError) => {
          console.log(sendChatError);
        });
      }, 1000);
    }
  };

  const handleUserName = (item): string => {
    if (item?.user?.username !== 'AnonymousUser') {
      return item?.user?.username;
    }
    return `Anonymous ${anon_user_info_emoji_name}`;
  };

  const updateChatContinuity = (chatsData: ChatSchema[]) => {
    const updatedChats = chatsData.map((currentChat, currentIndex) => {
      const previousChat = chatsData[currentIndex + 1];

      if (previousChat) {
        if (
          currentChat?.userId === previousChat?.userId &&
          (previousChat?.rawJson?.isSystem || previousChat?.rawJson?.type === 'system')
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
  }, [localDb, chat, selectedChannel]);

  return {
    chats,
    selectedChannel,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat,
    handleUserName,
    updateChatContinuity
  };
}

export default useChatScreenHook;
