import {ChannelList} from '../../database/schema/ChannelList.types';

export interface ChannelItemProps {
  channel: ChannelList;
  onChannelPressed: () => void;
}
