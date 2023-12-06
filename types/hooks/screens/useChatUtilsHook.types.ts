import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatUtilsHook {
  selectedChannel: ChannelList | null;
  selectedChannelKey: number;
  goBack: () => void;
  goToChatScreen: (channel: ChannelList, from?: string) => void;
  goToMoveChat: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: () => void;
  goToChatInfoScreen: () => void;
  goBackFromChatScreen: () => void;
  handleTextSystem: (item: any) => string;
  splitSystemMessage: (message: string) => string[];
}

export default UseChatUtilsHook;
