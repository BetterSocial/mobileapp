import {ChatSchema} from '../../database/schema/ChannelList.types';

interface UseAnonymousChatScreenHook {
  chats: ChatSchema[];
  goBackFromChatScreen: () => void;
}

export default UseAnonymousChatScreenHook;
