import * as React from 'react';

import ChatSchema from '../../database/schema/ChatSchema';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';

const useAnonymousChatScreenHook = () => {
  const {localDb, chat} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen} = useChatUtilsHook();

  const [chats, setChats] = React.useState([]);

  const initChatData = async () => {
    if (!localDb) return;
    const data = await ChatSchema.getAll(localDb, selectedChannel);
    setChats(data);
  };

  React.useEffect(() => {
    initChatData();
  }, [localDb, chat]);

  return {
    chats,
    goBackFromChatScreen
  };
};

export default useAnonymousChatScreenHook;
