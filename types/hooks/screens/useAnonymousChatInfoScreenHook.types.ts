import {ChannelList, ChannelListMemberSchema} from '../../database/schema/ChannelList.types';

interface UseAnonymousChatInfoScreenHook {
  channelInfo: ChannelList;
  goBack: () => void;
  onContactPressed: (item: ChannelListMemberSchema) => void;
}

export default UseAnonymousChatInfoScreenHook;
