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
import {getAnonymousUserId, getUserId} from '../../utils/users';
import {randomString} from '../../utils/string/StringUtils';

function useChatScreenHook(type: 'SIGNED' | 'ANONYMOUS'): UseChatScreenHook {
  const {localDb, chat, refresh} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen} = useChatUtilsHook();

  const [chats, setChats] = React.useState<ChatSchema[]>([]);
  const {anon_user_info_emoji_name} = selectedChannel?.rawJson?.channel || {};
  const initChatData = async () => {
    if (!localDb && !selectedChannel) return;
    const myUserId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    const data = (await ChatSchema.getAll(
      localDb,
      selectedChannel?.id,
      myUserId,
      myAnonymousId
    )) as ChatSchema[];
    setChats(data);
  };

  const sendChat = async (
    message: string = randomString(20),
    iteration = 0,
    sendingChatSchema: ChatSchema = null
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
          localDb
        );

        await currentChatSchema.save(localDb);
        refresh('chat');
        refresh('channelList');
      }

      let channelType = 1;
      if (selectedChannel?.channelType?.toLowerCase() === 'group') channelType = 2;
      if (selectedChannel?.rawJson?.channel?.channel_type === 4) channelType = 4;
      let response;
      if (type === 'ANONYMOUS') {
        response = await AnonymousMessageRepo.sendAnonymousMessage(selectedChannel?.id, message);
      } else {
        response = await SignedMessageRepo.sendSignedMessage(
          selectedChannel?.id,
          message,
          channelType
        );
      }
      console.log({channelType, response, selectedChannel}, 'susio');

      await currentChatSchema.updateChatSentStatus(localDb, response);
      refresh('chat');
      refresh('channelList');
    } catch (e) {
      console.log(e);
      if (e?.response?.data?.status === 'Channel is blocked') return;

      setTimeout(() => {
        sendChat(message, iteration + 1, currentChatSchema).catch((sendChatError) => {
          console.log(sendChatError);
        });
      }, 1000);
    }
  };

  const handleUserName = (item) => {
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
