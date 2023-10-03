import ChatSchema from '../../../src/database/schema/ChatSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatScreenHook {
  chats: ChatSchema[];
  goBackFromChatScreen: () => void;
  goToChatInfoScreen: () => void;
  sendChat: (message: string) => Promise<void>;
  selectedChannel: ChannelList;
}

export default UseChatScreenHook;
