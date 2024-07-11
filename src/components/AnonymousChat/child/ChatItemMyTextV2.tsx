/* eslint-disable no-unexpected-multiline */
import * as React from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';

import ChatContextMenuView from '../../ContextMenuView/ChatContextMenuView';
import ChatItemAttachment from './ChatItemAttachment';
import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
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
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {SIGNED} from '../../../hooks/core/constant';
import {fonts, normalizeFontSize} from '../../../utils/fonts';

const {width} = Dimensions.get('screen');

const AVATAR_SIZE = 24;
const CONTAINER_LEFT_PADDING = 60;
const CONTAINER_RIGHT_PADDING = 10;

const styles = StyleSheet.create({
  chatContainer: {
    display: 'flex',
    flexDirection: 'row',
    marginBottom: dimen.normalizeDimen(8),
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
  chatType,
  chatItem
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

  const getStyles = () => {
    if (chatItem?.type === 'deleted') {
      return styles.deletedText;
    }

    return styles.text;
  };

  return (
    <View style={[styles.chatContainer, isContinuous ? {marginTop: dimen.normalizeDimen(-4)} : {}]}>
      <ChatContextMenuView contextMenuType="MyChatContextMenu" chat={chatItem}>
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
          {attachments.length <= 0 && (
            <MemoLinkDetectionText
              text={message}
              linkTextStyle={getStyles()}
              withTopicDetection={true}
            />
          )}

          {renderIcon()}
        </View>
      </ChatContextMenuView>
      {renderAvatar()}
    </View>
  );
};

export default React.memo(ChatItemMyTextV2);
