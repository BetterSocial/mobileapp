import {ANONYMOUS, SIGNED} from '../../../src/hooks/core/constant';
import {ChannelList} from '../../database/schema/ChannelList.types';

export interface ContactScreenPayload {
  from: typeof ANONYMOUS | typeof SIGNED;
}

interface UseChatUtilsHook {
  isLoadingFetchingChannelDetail: boolean;
  selectedChannel: ChannelList | null;
  selectedChannelKey: number;
  fetchChannelDetail: (channel: ChannelList) => void;
  goBack: () => void;
  goToChatScreen: (channel: ChannelList, from?: string) => void;
  goToMoveChat: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
  goToChatInfoScreen: () => void;
  goBackFromChatScreen: () => void;
  handleTextSystem: (item: any) => string;
  setSelectedChannel: (channel: ChannelList) => void;
  splitSystemMessage: (message: string) => string[];
}

export default UseChatUtilsHook;
