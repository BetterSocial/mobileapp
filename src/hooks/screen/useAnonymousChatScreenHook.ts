import * as React from 'react';

import ChatSchema from '../../database/schema/ChatSchema';
import UseAnonymousChatScreenHook from '../../../types/hooks/screens/useAnonymousChatScreenHook.types';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {getAnonymousUserId} from '../../utils/users';
import {getUserId} from '../../utils/token';

function useAnonymousChatScreenHook(): UseAnonymousChatScreenHook {
  const {localDb, chat} = useLocalDatabaseHook();
  const {selectedChannel, goBackFromChatScreen} = useChatUtilsHook();

  const [chats, setChats] = React.useState([]);

  const initChatData = async () => {
    if (!localDb) return;
    const myUserId = await getUserId();
    const myAnonymousId = await getAnonymousUserId();
    console.log('myUserId');
    console.log(myUserId);
    const data = await ChatSchema.getAll(localDb, selectedChannel, myUserId, myAnonymousId);
    setChats(data);
  };

  React.useEffect(() => {
    initChatData();
  }, [localDb, chat, selectedChannel]);

  return {
    chats,
    goBackFromChatScreen
  };
}

export default useAnonymousChatScreenHook;
