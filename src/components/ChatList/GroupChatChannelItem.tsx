/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import React from 'react';
import {StyleProp, Text, View, ViewStyle} from 'react-native';

import ChannelContent from './elements/ChannelContent';
import ChannelImage from './elements/ChannelImage';
import CustomPressable from '../CustomPressable';
import useProfileHook from '../../hooks/core/profile/useProfileHook';
import {COLORS} from '../../utils/theme';
import {ChannelItemProps} from '../../../types/component/ChatList/ChannelItem.types';
import {DELETED_MESSAGE_TEXT} from '../../utils/constants';
import {calculateTime} from '../../utils/time';
import {channelItemStyles as styles} from './ChannelItem.style';

const GroupChatChannelItem = (props: ChannelItemProps) => {
  const {channel: groupChat, onChannelPressed} = props;
  const {signedProfileId} = useProfileHook();
  const channelType = 'GROUP';
  const channelPicture = groupChat?.channelPicture;

  const unreadCount = groupChat?.unreadCount;
  const hasBadge = unreadCount > 0;

  const isMe = groupChat?.lastUpdatedBy === signedProfileId;
  const firstMessage = groupChat?.firstMessage;
  const firstMessageText = firstMessage?.message;
  let description = groupChat?.description;

  if (['deleted', 'notification-deleted'].includes(groupChat?.firstMessage?.type || '')) {
    description = DELETED_MESSAGE_TEXT;
  } else if (groupChat?.firstMessage?.type === 'system') {
    description = firstMessageText || '';
  } else if (isMe) {
    description = `You: ${description}`;
  } else if (!isMe) {
    description = `${groupChat?.user?.username}: ${description}`;
  }

  const getMessageText = (): React.ReactNode => {
    let attachmentJson;

    try {
      attachmentJson = JSON.parse(groupChat?.firstMessage?.attachmentJson || '[]');
    } catch (e) {
      console.log('error parsing attachment json', e);
    }

    if (attachmentJson?.length > 1) {
      return (
        <Text>
          <Text>{isMe ? 'You: ' : `${groupChat?.user?.username}: `}</Text>
          <Text style={{fontStyle: 'italic'}}>Sent media 🏞️</Text>
        </Text>
      );
    }

    return `${description}`;
  };

  return (
    <CustomPressable onPress={onChannelPressed}>
      <View style={[styles.channelContainer, {backgroundColor: COLORS.signedPmGroupChannel}]}>
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
              <ChannelContent.Description>{getMessageText()}</ChannelContent.Description>
              {hasBadge && <ChannelContent.Badge>{unreadCount}</ChannelContent.Badge>}
            </View>
          </ChannelContent>
        </View>
      </View>
    </CustomPressable>
  );
};

export default GroupChatChannelItem;
