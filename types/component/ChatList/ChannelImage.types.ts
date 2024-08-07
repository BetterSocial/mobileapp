/* eslint-disable no-use-before-define */

import {ImageStyle} from 'react-native-fast-image';
import {StyleProp} from 'react-native';

export type ChannelImageProps = React.FC & {
  Big: React.FC<ChannelImageMainProps>;
  Small: React.FC<ChannelImageBadgeProps>;
};

export type ChannelImageMainProps = {
  type: 'TOPIC' | 'ANON_TOPIC' | 'GROUP' | 'GROUP_INFO';
  image?: string;
  style?: StyleProp<ImageStyle>;
};

export type ChannelImageBadgeProps = {
  type: 'TOPIC' | 'ANON_TOPIC' | 'GROUP' | 'GROUP_INFO';
};
