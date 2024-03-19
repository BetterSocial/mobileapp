/* eslint-disable no-use-before-define */

import {ImageStyle} from 'react-native-fast-image';
import {StyleProp} from 'react-native';
import {BetterSocialChannelType} from '../../database/schema/ChannelList.types';

export type ChannelImageProps = React.FC & {
  Big: React.FC<ChannelImageMainProps>;
  Small: React.FC<ChannelImageBadgeProps>;
};

export type ChannelImageMainProps = {
  type: BetterSocialChannelType;
  image?: string;
  style?: StyleProp<ImageStyle>;
};

export type ChannelImageBadgeProps = {
  type: BetterSocialChannelType;
};
