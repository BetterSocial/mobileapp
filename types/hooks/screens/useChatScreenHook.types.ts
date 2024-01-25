import ChatSchema from '../../../src/database/schema/ChatSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatScreenHook {
  chats: ChatSchema[];
  goBackFromChatScreen: () => void;
  goToChatInfoScreen: (params?: any) => void;
  sendChat: (message: string, attachments: any) => Promise<void>;
  selectedChannel: ChannelList;
  handleUserName: (item: ChatSchema) => string;
  updateChatContinuity: (chatsData: ChatSchema[]) => ChatSchema[];
}

export default UseChatScreenHook;
