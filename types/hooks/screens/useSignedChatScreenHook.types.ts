import {ChannelList, ChatSchema} from '../../database/schema/ChannelList.types';

interface UseSignedChatScreenHook {
  chats: ChatSchema[];
  goBackFromChatScreen: () => void;
  goToChatInfoScreen: () => void;
  sendChat: (message: string) => void;
  selectedChannel: ChannelList;
}

export default UseSignedChatScreenHook;
