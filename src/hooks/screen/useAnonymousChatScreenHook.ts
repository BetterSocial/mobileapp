import * as React from 'react';

import ChatSchema from '../../database/schema/ChatSchema';
import UseAnonymousChatScreenHook from '../../../types/hooks/screens/useAnonymousChatScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';
import {randomString} from '../../utils/string/StringUtils';

function useAnonymousChatScreenHook(): UseAnonymousChatScreenHook {
  const {localDb, chat} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen, goToChatInfoScreen} = useChatUtilsHook();

  const [chats, setChats] = React.useState([]);

  const initChatData = async () => {
    if (!localDb) return;
    const myUserId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    const data = await ChatSchema.getAll(localDb, selectedChannel?.id, myUserId, myAnonymousId);
    setChats(data);
  };

  const sendChat = async (message: string = randomString(20)) => {
    console.log('message');
    console.log(message);
  };

  React.useEffect(() => {
    initChatData();
  }, [localDb, chat, selectedChannel]);

  return {
    chats,
    goBackFromChatScreen,
    goToChatInfoScreen,
    sendChat
  };
}

export default useAnonymousChatScreenHook;
