import ChannelListSchema from '../../../src/database/schema/ChannelListSchema';
import {ANONYMOUS, SIGNED} from '../../../src/hooks/core/constant';
import {AllowedGoToChatScreen} from '../../../src/hooks/core/chat/useChatUtilsHook';
import {ChannelList} from '../../database/schema/ChannelList.types';

export interface ContactScreenPayload {
  from: typeof ANONYMOUS | typeof SIGNED;
}

interface UseChatUtilsHook {
  isLoadingFetchingChannelDetail: boolean;
  selectedChannel: ChannelList | null;
  selectedChannelKey: number;
  fetchChannelDetail: (channel: ChannelListSchema) => void;
  goBack: () => void;
  goToChatScreen: (channel: ChannelListSchema, from: AllowedGoToChatScreen) => void;
  goToMoveChat: (channel: ChannelListSchema, from?: string | undefined) => void;
  goToPostDetailScreen: (channel: ChannelListSchema) => void;
  goToCommunityScreen: (channel: ChannelListSchema) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
  goToChatInfoScreen: () => void;
  goBackFromChatScreen: () => void;
  handleTextSystem: (item: any) => string;
  setChannelAsRead: (
    channel: ChannelListSchema,
    ignoreRefresh?: boolean | undefined
  ) => Promise<void>;
  setSelectedChannel: (channel: ChannelListSchema) => void;
  splitSystemMessage: (message: string) => string[];
}

export default UseChatUtilsHook;
