import ChatSchema from '../../../src/database/schema/ChatSchema';
import {AllowedGoToChatScreen} from '../../../src/hooks/core/chat/useChatUtilsHook';
import {ChannelList, GoToChatScreenOptionalParams} from '../../database/schema/ChannelList.types';
import {ContactScreenPayload} from './useChatUtilsHook.types';

interface UseSignedChannelListScreenHook {
  channels: ChannelList[];
  fetchLatestTopicPost: (topicName: string) => Promise<void>;
  goToChatScreen: (
    channel: ChannelList,
    from?: AllowedGoToChatScreen,
    optionalParams?: GoToChatScreenOptionalParams
  ) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
}

export default UseSignedChannelListScreenHook;
