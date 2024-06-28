import {AllowedGoToChatScreen} from '../../../src/hooks/core/chat/useChatUtilsHook';
import {ChannelList, GoToChatScreenOptionalParams} from '../../database/schema/ChannelList.types';
import {ContactScreenPayload} from './useChatUtilsHook.types';

interface UseAnonymousChannelListScreenHook {
  channels: ChannelList[];
  goToChatScreen: (
    channel: ChannelList,
    from?: AllowedGoToChatScreen,
    optionalParams?: GoToChatScreenOptionalParams
  ) => void;
  goToPostDetailScreen: (channel: ChannelList) => void;
  goToCommunityScreen: (channel: ChannelList) => void;
  goToContactScreen: ({from}: ContactScreenPayload) => void;
  fetchLatestTopicPost: (topicName: string) => Promise<void>;
}

export default UseAnonymousChannelListScreenHook;
