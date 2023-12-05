import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseSignedChannelListScreenHook {
  channels: ChannelList[];
  goToChatScreen: (channel: ChannelList) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: () => void;
}

export default UseSignedChannelListScreenHook;
