import ChatSchema from '../../../src/database/schema/ChatSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

export interface MessageChannelItemProps {
  item: ChannelList;
  onChannelPressed: (initialChats?: ChatSchema[]) => void;
  getInitialMessages?: (channelId: string) => Promise<ChatSchema[]>;
}
