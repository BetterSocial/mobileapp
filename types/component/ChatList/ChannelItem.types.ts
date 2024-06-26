import ChatSchema from '../../../src/database/schema/ChatSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

export interface ChannelItemProps {
  channel: ChannelList;
  onChannelPressed: (initialChats?: ChatSchema[]) => void;
  getInitialMessages?: (channelId: string) => Promise<ChatSchema[]>;
}

export interface TopicChannelItemProps extends ChannelItemProps {
  fetchTopicLatestMessage: (topicId: string) => void;
}
