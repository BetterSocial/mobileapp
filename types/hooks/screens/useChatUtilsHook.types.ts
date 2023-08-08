import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatUtilsHook {
  selectedChannel: ChannelList | null;
  goBack: () => void;
  goToChatScreen: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToChatInfoScreen: () => void;
  goBackFromChatScreen: () => void;
  setSelectedChannelAsRead: () => void;
}

export default UseChatUtilsHook;
