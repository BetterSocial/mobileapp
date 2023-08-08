import {ChannelList} from '../../database/schema/ChannelList.types';

export interface MessageChannelItemProps {
  item: ChannelList;
  onChannelPressed: () => void;
}
