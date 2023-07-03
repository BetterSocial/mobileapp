import 'react-native-get-random-values';

import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {v4 as uuid} from 'uuid';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChannelList from '../../database/schema/ChannelListSchema';
import ChatSchema from '../../database/schema/ChatSchema';
import UseAnonymousChatScreenHook from '../../../types/hooks/screens/useAnonymousChatScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';
import {randomString} from '../../utils/string/StringUtils';

function useAnonymousChatScreenHook(): UseAnonymousChatScreenHook {
  const {localDb, chat, refresh} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen, setSelectedChannelAsRead} =
    useChatUtilsHook();

  const [chats, setChats] = React.useState<ChatSchema[]>([]);
  const [chatInfo, setChatInfo] = React.useState<ChannelList>(null);

  const initChatData = async () => {
    if (!localDb) return;
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

  const initChatInfoData = async () => {
    console.log('initChatInfoData');
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

      const response = await AnonymousMessageRepo.sendAnonymousMessage(
        selectedChannel?.id,
        message
      );

      await currentChatSchema.updateChatSentStatus(localDb, response);
      refresh('chat');
      refresh('channelList');
    } catch (e) {
      console.log(e);

      setTimeout(() => {
        sendChat(message, iteration + 1, currentChatSchema).catch((sendChatError) => {
          console.log(sendChatError);
        });
      }, 1000);
    }
  };

  React.useEffect(() => {
    initChatData();
    initChatInfoData();
    setSelectedChannelAsRead();
  }, [localDb, chat, selectedChannel]);

  return {
    chats,
    selectedChannel,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat
  };
}

export default useAnonymousChatScreenHook;
