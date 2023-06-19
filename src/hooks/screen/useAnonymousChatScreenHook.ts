import * as React from 'react';

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
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen} = useChatUtilsHook();

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

  const sendChat = async (message: string = randomString(20)) => {
    const myAnonymousId = await getAnonymousUserId();
    try {
      const randomId = randomString(20);
      const sendingChatSchema = ChatSchema.generateSendingChat(
        randomId,
        myAnonymousId,
        selectedChannel?.id,
        message
      );

      await sendingChatSchema.save(localDb);
      refresh('chat');
      refresh('channelList');
      const response = await AnonymousMessageRepo.sendAnonymousMessage(
        selectedChannel?.id,
        message
      );

      await sendingChatSchema.updateChatSentStatus(localDb, response);
      refresh('chat');
      refresh('channelList');
    } catch (e) {
      console.log(e);
    }
  };

  React.useEffect(() => {
    initChatData();
    initChatInfoData();
  }, [localDb, chat, selectedChannel]);

  return {
    chats,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat
  };
}

export default useAnonymousChatScreenHook;
