import {ChannelList} from '../../database/schema/ChannelList.types';
import {ContactScreenPayload} from './useChatUtilsHook.types';

interface UseSignedChannelListScreenHook {
  channels: ChannelList[];
  fetchLatestTopicPost: (topicName: string) => Promise<void>;
  goToChatScreen: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
}

export default UseSignedChannelListScreenHook;
