/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import React from 'react';
import {View} from 'react-native';

import ChannelContent from './elements/ChannelContent';
import ChannelImage from './elements/ChannelImage';
import CustomPressable from '../CustomPressable';
import {ChannelItemProps} from '../../../types/component/ChatList/ChannelItem.types';
import {Context} from '../../context';
import {calculateTime} from '../../utils/time';
import {channelItemStyles as styles} from './ChannelItem.style';

const GroupChatChannelItem = (props: ChannelItemProps) => {
  const {channel: groupChat, onChannelPressed} = props;
  const [profileContext] = (React.useContext(Context) as unknown as any).profile;
  const {myProfile} = profileContext;
  const channelType = 'GROUP';
  const channelPicture = groupChat?.channelPicture;

  const unreadCount = groupChat?.unreadCount;
  const hasBadge = unreadCount > 0;

  const description = groupChat?.rawJson?.firstMessage;
  const isSystemDescription = description?.type === 'system';
  const sender = description?.user?.username ?? description?.user?.name;
  const isMeAsSender = sender === myProfile?.username;

  let channelDescription = groupChat?.description;
  if (!isSystemDescription) {
    channelDescription = isMeAsSender
      ? `You: ${channelDescription}`
      : `${sender}: ${channelDescription}`;
  }

  return (
    <CustomPressable onPress={onChannelPressed}>
      <View style={styles.channelContainer}>
        <ChannelImage>
          <ChannelImage.Big type={channelType} image={channelPicture} />
          <ChannelImage.Small type={channelType} />
        </ChannelImage>

        <View style={styles.contentContainer}>
          <ChannelContent>
            <View style={{flexDirection: 'row'}}>
              <ChannelContent.Title>{groupChat?.name}</ChannelContent.Title>
              <ChannelContent.Time>
                {calculateTime(groupChat?.lastUpdatedAt, true)}
              </ChannelContent.Time>
            </View>
            <View style={{flexDirection: 'row'}}>
              <ChannelContent.Description>{channelDescription}</ChannelContent.Description>
              {hasBadge && <ChannelContent.Badge>{unreadCount}</ChannelContent.Badge>}
            </View>
          </ChannelContent>
        </View>
      </View>
    </CustomPressable>
  );
};

export default GroupChatChannelItem;
