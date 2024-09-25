import ChannelListSchema from '../../../src/database/schema/ChannelListSchema';
import {ANONYMOUS, SIGNED} from '../../../src/hooks/core/constant';
import {AllowedGoToChatScreen} from '../../../src/hooks/core/chat/useChatUtilsHook';
import {ChannelList, GoToChatScreenOptionalParams} from '../../database/schema/ChannelList.types';

export interface ContactScreenPayload {
  from: typeof ANONYMOUS | typeof SIGNED;
}

interface UseChatUtilsHook {
  isLoadingFetchingChannelDetail: boolean;
  selectedChannel: ChannelList | null;
  selectedChannelKey: number;
  fetchChannelDetail: (channel: ChannelListSchema, callback?: () => Promise<void>) => void;
  goBack: () => void;
  goToChatScreen: (
    channel: ChannelListSchema,
    from: AllowedGoToChatScreen,
    optionalParams?: GoToChatScreenOptionalParams
  ) => void;
  goToMoveChat: (channel: ChannelListSchema, from?: string | undefined) => void;
  goToPostDetailScreen: (channel: ChannelListSchema) => void;
  goToCommunityScreen: (channel: ChannelListSchema) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
  goToChatInfoScreen: (params?: any) => void;
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
