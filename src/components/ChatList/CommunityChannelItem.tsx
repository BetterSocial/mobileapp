/* eslint-disable no-use-before-define */
import React from 'react';
import {View} from 'react-native';

import ChannelContent from './elements/ChannelContent';
import ChannelImage from './elements/ChannelImage';
import CustomPressable from '../CustomPressable';
import useTopicChannelItemHook from './hook/useTopicChannelItemHook';
import {COLORS} from '../../utils/theme';
import {TopicChannelItemProps} from '../../../types/component/ChatList/ChannelItem.types';
import {calculateTime} from '../../utils/time';
import {channelItemStyles as styles} from './ChannelItem.style';

const CommunityChannelItem = (props: TopicChannelItemProps) => {
  useTopicChannelItemHook(props);
  const {channel: community, onChannelPressed} = props;
  const channelPicture = community?.channelPicture;
  const unreadCount = community?.unreadCount;
  const hasBadge = unreadCount > 0;

  const channelType = () => {
    switch (community?.channelType) {
      case 'ANON_TOPIC':
        return 'ANON_TOPIC';
      case 'TOPIC':
        return 'TOPIC';
      default:
        return 'TOPIC';
    }
  };

  const backgroundColor =
    channelType() === 'ANON_TOPIC' ? COLORS.anonTopicChannel : COLORS.signedTopicChannel;

  return (
    <CustomPressable onPress={onChannelPressed}>
      <View style={[styles.channelContainer, {backgroundColor}]}>
        <ChannelImage>
          <ChannelImage.Big type={channelType()} image={channelPicture} />
          <ChannelImage.Small type={channelType()} />
        </ChannelImage>

        <View style={styles.contentContainer}>
          <ChannelContent>
            <View style={{flexDirection: 'row'}}>
              <ChannelContent.Title>{community?.name}</ChannelContent.Title>
              <ChannelContent.Time>
                {calculateTime(community?.lastUpdatedAt, true)}
              </ChannelContent.Time>
            </View>
            <View style={{flexDirection: 'row'}}>
              <ChannelContent.Description>
                {community?.description ?? 'See latest post'}
              </ChannelContent.Description>
              {hasBadge && <ChannelContent.Badge>{unreadCount}</ChannelContent.Badge>}
            </View>
          </ChannelContent>
        </View>
      </View>
    </CustomPressable>
  );
};

export default CommunityChannelItem;
