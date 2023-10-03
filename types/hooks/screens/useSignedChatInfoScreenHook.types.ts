import {ChannelList, ChannelListMemberSchema} from '../../database/schema/ChannelList.types';

interface UseSignedChatInfoScreenHook {
  channelInfo: ChannelList;
  goBack: () => void;
  onContactPressed: (item: ChannelListMemberSchema) => void;
}

export default UseSignedChatInfoScreenHook;
