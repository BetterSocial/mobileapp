/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {SIGNED} from '../../../hooks/core/constant';
import {fonts} from '../../../utils/fonts';
import {COLORS} from '../../../utils/theme';
import {
  AVATAR_MARGIN,
  BUBBLE_LEFT_PADDING,
  BUBBLE_RIGHT_PADDING,
  BUBBLE_LEFT_PADDING_ATTACHMENT,
  BUBBLE_RIGHT_PADDING_ATTACHMENT
} from './ChatItemAttachmentStyles';
import ChatItemAttachment from './ChatItemAttachment';

const {width} = Dimensions.get('screen');

const AVATAR_SIZE = 24;
const CONTAINER_LEFT_PADDING = 60;
const CONTAINER_RIGHT_PADDING = 10;

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    maxWidth: width,
    paddingLeft: CONTAINER_LEFT_PADDING,
    paddingRight: CONTAINER_RIGHT_PADDING
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  containerSigned: {
    backgroundColor: COLORS.signed_secondary
  },
  containerAnon: {
    backgroundColor: COLORS.anon_secondary
  },
  textContainer: {
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 12,
    borderTopEndRadius: 0,
    flex: 1
  },
  textContainerNewLine: {},
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.white2
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white2
  },
  avatar: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: 12,
    marginLeft: AVATAR_MARGIN
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: COLORS.gray500,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center',
    color: COLORS.gray500
  },
  icon: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 6,
    right: 8
  },
  iconNewLine: {
    alignSelf: 'flex-end',
    position: 'absolute',
    bottom: 6,
    right: 8
  },
  ml8: {
    marginLeft: 8
  },
  marginNonContinuous: {
    marginLeft: 4
  },
  marginContinuous: {
    marginLeft: 5
  }
});

const ChatItemMyTextV2 = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  attachments = [],
  status = ChatStatus.PENDING,
  avatar,
  chatType
}: ChatItemMyTextProps) => {
  const renderIcon = React.useCallback(() => {
    if (status === ChatStatus.PENDING)
      return (
        <View style={styles.icon}>
          <IconChatClockGrey width={12} height={12} />
        </View>
      );

    return (
      <View style={styles.icon}>
        <IconChatCheckMark />
      </View>
    );
  }, []);

  const renderAvatar = React.useCallback(() => {
    if (isContinuous) return <View style={[styles.avatar, styles.marginContinuous]} />;
    return <View style={styles.marginNonContinuous}>{avatar}</View>;
  }, []);

  const handleTextContainerStyle = () => {
    const isAttachment = attachments.length > 0;
    const paddingStyle = {
      paddingLeft: isAttachment ? BUBBLE_LEFT_PADDING_ATTACHMENT : BUBBLE_LEFT_PADDING,
      paddingRight: isAttachment ? BUBBLE_RIGHT_PADDING_ATTACHMENT : BUBBLE_RIGHT_PADDING
    };
    if (chatType === SIGNED) {
      return [styles.containerSigned, styles.textContainer, paddingStyle];
    }
    return [styles.containerAnon, styles.textContainer, paddingStyle];
  };

  return (
    <View style={styles.chatContainer}>
      <View style={handleTextContainerStyle()}>
        {!isContinuous && (
          <View
            style={[styles.chatTitleContainer, attachments.length > 0 ? {marginBottom: 4} : {}]}>
            <Text style={styles.userText}>{username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
        {attachments.length > 0 && <ChatItemAttachment attachments={attachments} />}
        {attachments.length <= 0 && <Text style={styles.text}>{message}</Text>}

        {renderIcon()}
      </View>
      {renderAvatar()}
    </View>
  );
};

export default React.memo(ChatItemMyTextV2);
