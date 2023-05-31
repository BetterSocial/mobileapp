import {ChatSchema} from '../../database/schema/ChannelList.types';

interface UseAnonymousChatScreenHook {
  chats: ChatSchema[];
  goBackFromChatScreen: () => void;
  goToChatInfoScreen: () => void;
}

export default UseAnonymousChatScreenHook;
