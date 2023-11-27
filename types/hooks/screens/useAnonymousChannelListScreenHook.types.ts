import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseAnonymousChannelListScreenHook {
  channels: ChannelList[];
  goToChatScreen: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToContactScreen: () => void;
}

export default UseAnonymousChannelListScreenHook;
