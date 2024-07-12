/* eslint-disable no-use-before-define */

export type ChannelContentProps = React.FC & {
  Title: React.FC<ChannelContentTextProps>;
  Description: React.FC<ChannelContentTextProps>;
  Time: React.FC<ChannelContentTextProps>;
  Badge: React.FC<ChannelContentTextProps>;
};

export type ChannelContentTextProps = {
  children: string | number | React.ReactNode;
};
