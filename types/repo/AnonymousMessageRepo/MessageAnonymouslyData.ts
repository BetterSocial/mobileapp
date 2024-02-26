import {ChannelData} from './ChannelData';
import {Member} from './AnonymousChannelsData';

export interface MessageAnonymouslyData {
  channel: ChannelData;
  members: Member[];
  anon_user_info_emoji_name: string | null | undefined;
  anon_user_info_emoji_code: string | null | undefined;
  anon_user_info_color_name: string | null | undefined;
  anon_user_info_color_code: string | null | undefined;
  appAdditionalData?: {
    rawJson: any;
    message: string;
    targetName: string;
    targetImage: string;
  };
}
