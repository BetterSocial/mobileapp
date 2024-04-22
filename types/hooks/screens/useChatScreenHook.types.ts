import ChatSchema from '../../../src/database/schema/ChatSchema';
import UserSchema from '../../../src/database/schema/UserSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatScreenHook {
  chats: ChatSchema[];
  isLoadingFetchAllMessage: boolean;
  goBackFromChatScreen: () => void;
  goToChatInfoScreen: (params?: any) => void;
  sendChat: (message: string, attachments: any) => Promise<void>;
  selectedChannel: ChannelList;
  selfAnonUserInfo: UserSchema | null;
  handleUserName: (item: ChatSchema) => string;
  updateChatContinuity: (chatsData: ChatSchema[]) => ChatSchema[];
}

export default UseChatScreenHook;
