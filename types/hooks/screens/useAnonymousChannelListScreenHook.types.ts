import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseAnonymousChannelListScreenHook {
  channels: ChannelList[];
  goToChatScreen: (channel: ChannelList) => void;
}

export default UseAnonymousChannelListScreenHook;
