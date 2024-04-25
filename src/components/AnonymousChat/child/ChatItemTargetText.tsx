/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
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
import {LinkableText} from '../../LinkableText';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginTop: 4,
    marginBottom: 4,
    maxWidth: width,
    paddingRight: 60,
    paddingLeft: 10
  },
  chatTitleContainer: {
    display: 'flex',
    flexDirection: 'row'
  },
  textContainer: {
    backgroundColor: COLORS.gray110,
    paddingTop: 4,
    paddingBottom: 4,
    borderRadius: 12,
    borderTopStartRadius: 0,
    flex: 1
  },
  userText: {
    fontFamily: fonts.inter[600],
    fontSize: 12,
    lineHeight: 18,
    color: COLORS.white
  },
  text: {
    fontFamily: fonts.inter[400],
    fontSize: 16,
    lineHeight: 24,
    color: COLORS.white
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: AVATAR_MARGIN
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    marginLeft: 5,
    marginRight: 5,
    backgroundColor: COLORS.gray510,
    alignSelf: 'center'
  },
  timeText: {
    fontFamily: fonts.inter[200],
    fontSize: 10,
    lineHeight: 12.19,
    alignSelf: 'center',
    color: COLORS.gray510
  },
  mr8: {
    marginRight: 4
  }
});

const ChatItemTargetText = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  attachments = [],
  avatar
}: ChatItemMyTextProps) => {
  const renderAvatar = React.useCallback(() => {
    if (isContinuous) return <View style={styles.avatar} />;
    return <View style={styles.mr8}>{avatar}</View>;
  }, []);

  const handleTextContainerStyle = () => {
    const isAttachment = attachments.length > 0;
    const paddingStyle = {
      paddingLeft: isAttachment ? BUBBLE_LEFT_PADDING_ATTACHMENT : BUBBLE_LEFT_PADDING,
      paddingRight: isAttachment ? BUBBLE_RIGHT_PADDING_ATTACHMENT : BUBBLE_RIGHT_PADDING
    };
    return [styles.textContainer, paddingStyle];
  };

  return (
    <View style={styles.chatContainer}>
      {renderAvatar()}
      <View style={handleTextContainerStyle()}>
        {!isContinuous && (
          <View
            testID="chat-item-user-info"
            style={[styles.chatTitleContainer, attachments.length > 0 ? {marginBottom: 4} : {}]}>
            <Text style={styles.userText}>{username}</Text>
            <View style={styles.dot} />
            <Text style={styles.timeText}>{time}</Text>
          </View>
        )}
        {attachments.length > 0 && <ChatItemAttachment attachments={attachments} />}
        {attachments.length <= 0 && (
          <View testID="chat-item-message">
            <LinkableText style={styles.text} text={message} />
          </View>
        )}
      </View>
    </View>
  );
};

export default ChatItemTargetText;
