import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseAnonymousChannelListScreenHook {
  channels: ChannelList[];
  goToChatScreen: (channel: string) => void;
}

export default UseAnonymousChannelListScreenHook;
