import {ChannelList} from '../../database/schema/ChannelList.types';

export interface ChannelItemProps {
  channel: ChannelList;
  onChannelPressed: () => void;
}

export interface TopicChannelItemProps extends ChannelItemProps {
  fetchTopicLatestMessage: (topicId: string) => void;
}
