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
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';
import {randomString} from '../../utils/string/StringUtils';

function useChatScreenHook(type: 'SIGNED' | 'ANONYMOUS'): UseChatScreenHook {
  const {localDb, chat, refresh} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen} = useChatUtilsHook();

  const [chats, setChats] = React.useState<ChatSchema[]>([]);

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

    const myAnonymousId = await getAnonymousUserId();
    try {
      const randomId = uuid();

      if (currentChatSchema === null) {
        currentChatSchema = await ChatSchema.generateSendingChat(
          randomId,
          myAnonymousId,
          selectedChannel?.id,
          message,
          localDb
        );

        await currentChatSchema.save(localDb);
        refresh('chat');
        refresh('channelList');
      }

      let response;
      if (type === 'ANONYMOUS') {
        response = await AnonymousMessageRepo.sendAnonymousMessage(selectedChannel?.id, message);
      } else {
        response = await SignedMessageRepo.sendSignedMessage(selectedChannel?.id, message);
      }

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

  React.useEffect(() => {
    initChatData();
  }, [localDb, chat, selectedChannel]);

  return {
    chats,
    selectedChannel,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat
  };
}

export default useChatScreenHook;
