import {ChannelList} from '../../database/schema/ChannelList.types';
import {ContactScreenPayload} from './useChatUtilsHook.types';

interface UseAnonymousChannelListScreenHook {
  channels: ChannelList[];
  goToChatScreen: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
}

export default UseAnonymousChannelListScreenHook;
