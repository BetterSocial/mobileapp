/* eslint-disable no-use-before-define */

export type ChannelImageProps = React.FC & {
  Big: React.FC<ChannelImageMainProps>;
  Small: React.FC<ChannelImageBadgeProps>;
};

export type ChannelImageMainProps = {
  type: 'COMMUNITY' | 'GROUP' | 'GROUP_INFO';
  image?: string;
  imageStyle?: object;
};

export type ChannelImageBadgeProps = {
  type: 'COMMUNITY' | 'GROUP' | 'GROUP_INFO';
};
