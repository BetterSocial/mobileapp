import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseAnonymousChatInfoScreenHook {
  channelInfo: ChannelList;
  goBack: () => void;
}

export default UseAnonymousChatInfoScreenHook;
