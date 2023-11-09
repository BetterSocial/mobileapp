import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatUtilsHook {
  selectedChannel: ChannelList | null;
  goBack: () => void;
  goToChatScreen: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToChatInfoScreen: () => void;
  goBackFromChatScreen: () => void;
  handleTextSystem: (item: any) => string;
  splitSystemMessage: (message: string) => string[];
}

export default UseChatUtilsHook;
