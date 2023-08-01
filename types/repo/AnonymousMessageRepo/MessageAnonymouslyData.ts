import {AnonymousChannelData, Member} from './AnonymousChannelsData';
import {ChannelData} from './ChannelData';

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
