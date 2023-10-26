/* eslint-disable no-use-before-define */
import React from 'react';
import {Text, View} from 'react-native';

import {
  ChannelContentProps,
  ChannelContentTextProps
} from '../../../../types/component/ChatList/ChannelContent.types';
import {channelContentStyles as styles} from './ChannelContent.style';

const ChannelContent: ChannelContentProps = ({children}) => {
  return <View>{children}</View>;
};

const Title: React.FC<ChannelContentTextProps> = ({children}) => {
  return (
    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.title}>
      {children}
    </Text>
  );
};

const Description: React.FC<ChannelContentTextProps> = ({children}) => {
  return (
    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.description}>
      {children}
    </Text>
  );
};

const Time: React.FC<ChannelContentTextProps> = ({children}) => {
  return <Text style={styles.time}>{children}</Text>;
};

const Badge: React.FC<ChannelContentTextProps> = ({children}) => {
  return (
    <View style={styles.containerBadge}>
      <Text style={styles.badge}>{children}</Text>
    </View>
  );
};

ChannelContent.Title = Title;
ChannelContent.Description = Description;
ChannelContent.Time = Time;
ChannelContent.Badge = Badge;
export default ChannelContent;
