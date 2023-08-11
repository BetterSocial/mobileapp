import {ChannelData} from './ChannelData';
import {Member} from './AnonymousChannelsData';

export interface MessageAnonymouslyData {
  channel: ChannelData;
  members: Member[];
  appAdditionalData?: {
    rawJson: any;
    message: string;
    targetName: string;
    targetImage: string;
  };
}
