/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import ChatContextMenuView from '../../ContextMenuView/ChatContextMenuView';
import ChatItemAttachment from './ChatItemAttachment';
import MemoLinkDetectionText from '../../Text/LinkDetectionText';
import dimen from '../../../utils/dimen';
import {
  AVATAR_MARGIN,
  BUBBLE_LEFT_PADDING,
  BUBBLE_LEFT_PADDING_ATTACHMENT,
  BUBBLE_RIGHT_PADDING,
  BUBBLE_RIGHT_PADDING_ATTACHMENT
} from './ChatItemAttachmentStyles';
import {COLORS} from '../../../utils/theme';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const {width} = Dimensions.get('screen');

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: dimen.normalizeDimen(8),
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
  deletedText: {
    color: COLORS.gray400,
    fontSize: normalizeFontSize(14),
    fontStyle: 'italic'
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
  avatar,
  chatItem,
  chatType
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

  const getStyles = () => {
    if (chatItem?.type === 'deleted') {
      return styles.deletedText;
    }

    return styles.text;
  };

  return (
    <View style={[styles.chatContainer, isContinuous ? {marginTop: dimen.normalizeDimen(-4)} : {}]}>
      {renderAvatar()}
      <ChatContextMenuView contextMenuType="TargetChatContextMenu" chat={chatItem} type={chatType}>
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
              <MemoLinkDetectionText
                linkTextStyle={getStyles()}
                text={message}
                withTopicDetection={true}
              />
            </View>
          )}
        </View>
      </ChatContextMenuView>
    </View>
  );
};

export default ChatItemTargetText;
