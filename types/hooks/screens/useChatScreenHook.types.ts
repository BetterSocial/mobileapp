import {UseMutationResult} from 'react-query';

import ChatSchema from '../../../src/database/schema/ChatSchema';
import UserSchema from '../../../src/database/schema/UserSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

export type GoToChatInfoScreenByTrigger = 'ProfilePicture' | 'OptionsButton';
interface UseChatScreenHook {
  chats: ChatSchema[];
  isLoadingFetchAllMessage: boolean;
  goBackFromChatScreen: () => void;
  goBackToChatTab: () => void;
  goToChatInfoScreen: (params?: any) => void;
  goToChatInfoScreenBy: (trigger: GoToChatInfoScreenByTrigger, params?: any) => void;
  sendChat: (message: string, attachments: any) => Promise<void>;
  selectedChannel: ChannelList;
  selfAnonUserInfo: UserSchema | null;
  handleUserName: (item: ChatSchema) => string;
  updateChatContinuity: (chatsData: ChatSchema[]) => ChatSchema[];
  sendChatMutation: UseMutationResult<void, unknown, any | undefined, unknown>;
}

export default UseChatScreenHook;
