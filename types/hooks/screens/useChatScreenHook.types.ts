import {QueryObserverResult, RefetchOptions, RefetchQueryFilters} from 'react-query';
import ChatSchema from '../../../src/database/schema/ChatSchema';
import UserSchema from '../../../src/database/schema/UserSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';
import BaseDbSchema from '../../../src/database/schema/BaseDbSchema';

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
  setIsLoadingFetchAllMessage: React.Dispatch<React.SetStateAction<boolean>>;
  refetchMessage: <TPageData>(
    options?: (RefetchOptions & RefetchQueryFilters<TPageData>) | undefined
  ) => Promise<QueryObserverResult<BaseDbSchema[], unknown>>;
}

export default UseChatScreenHook;
