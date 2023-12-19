/* eslint-disable no-unexpected-multiline */
// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import Animated, {withDelay, withSequence, withTiming} from 'react-native-reanimated';
import ContextMenu, {ContextMenuAction} from 'react-native-context-menu-view';
import {Swipeable} from 'react-native-gesture-handler';
import {Linking, Text, TouchableOpacity, View, ViewStyle} from 'react-native';
import FastImage from 'react-native-fast-image';
import {useNavigation, useNavigation} from '@react-navigation/core';

import ChatReplyView from './ChatReplyView';
import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import IconVideoPlay from '../../../assets/icon/IconVideoPlay';
import IconFile from '../../../assets/icon/IconFile';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {
  CONTEXT_MENU_COPY,
  CONTEXT_MENU_DELETE,
  CONTEXT_MENU_REPLY,
  MESSAGE_TYPE_DELETED,
  MESSAGE_TYPE_REPLY,
  MESSAGE_TYPE_REPLY_PROMPT
} from '../../../utils/constants';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
import {MessageType} from '../../../../types/hooks/screens/useMessageHook.types';
import {ScrollContext} from '../../../hooks/screen/useChatScreenHook';
import {calculateTime} from '../../../utils/time';
import {colors} from '../../../utils/colors';
import {
  containerStyle,
  dotStyle,
  messageStyle,
  styles,
  textContainerStyle,
  textStyle
} from './ChatItemText.style';
import {replyIcon} from './ChatItemTargetText';
import {formatBytes} from '../../../utils/string/StringUtils';

const ChatItemMyTextV2 = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  attachments = [],
  status = ChatStatus.PENDING,
  avatar,
  chatType,
  messageType,
  data
}: ChatItemMyTextProps) => {
  const navigation = useNavigation();
  const {
    setReplyPreview,
    onContextMenuPressed,
    onOpenMediaPreview,
    pulseAnimation,
    animatedBubbleStyle,
    animatedPulseStyle
  } = useMessageHook();
  const scrollContext = React.useContext(ScrollContext);
  const swipeableRef = React.useRef<Swipeable>(null);

  React.useEffect(() => {
    if (scrollContext?.selectedMessageId === data?.id) {
      pulseAnimation.value = withSequence(
        withDelay(300, withTiming(1.1, {duration: 200})),
        withTiming(1, {duration: 200})
      );
      scrollContext?.setSelectedMessageId(null);
    }
  }, [scrollContext?.selectedMessageId]);

  const isReply = messageType === MESSAGE_TYPE_REPLY;
  const isReplyPrompt = messageType === MESSAGE_TYPE_REPLY_PROMPT;
  const isShowUserInfo = !isContinuous || isReplyPrompt || isReply;

  const renderIcon = React.useCallback(() => {
    if (status === ChatStatus.PENDING)
      return (
        <View style={styles.iconNewLine}>
          <IconChatClockGrey color={colors.silver} width={12} height={12} />
        </View>
      );

    return (
      <View style={styles.iconNewLine}>
        <IconChatCheckMark color={colors.silver} width={12} height={12} />
      </View>
    );
  }, [status]);

  const contextMenuActions: ContextMenuAction[] = [
    {title: CONTEXT_MENU_REPLY, systemIcon: 'arrow.turn.up.left'}
  ];

  if (messageType !== MESSAGE_TYPE_DELETED) {
    contextMenuActions.push({title: CONTEXT_MENU_COPY, systemIcon: 'square.on.square'});
    contextMenuActions.push({title: CONTEXT_MENU_DELETE, systemIcon: 'trash', destructive: true});
  }

  const renderAvatar = React.useCallback(() => {
    if (!isShowUserInfo) return <View style={styles.avatar} />;
    return <View style={styles.mlBuble}>{avatar}</View>;
  }, [isShowUserInfo, avatar]);

  const onSwipeToReply = React.useCallback(
    (direction: 'left' | 'right') => {
      if (direction === 'right') return;
      if (swipeableRef.current) swipeableRef.current?.close();
      setReplyPreview({
        id: data?.id ?? data?.message?.id,
        user: {username},
        message,
        message_type: messageType as MessageType,
        updated_at: time,
        chatType,
        attachments
      });
    },
    [data, username, time, message, messageType, chatType, attachments]
  );

  return (
    <Swipeable
      testID="swipeable"
      ref={swipeableRef}
      friction={3}
      overshootFriction={2}
      onSwipeableOpen={onSwipeToReply}
      renderLeftActions={replyIcon}>
      <View style={containerStyle(true, isReplyPrompt)}>
        <Animated.View
          style={[
            styles.wrapper,
            animatedBubbleStyle as ViewStyle,
            animatedPulseStyle as ViewStyle
          ]}>
          <ContextMenu
            previewBackgroundColor="transparent"
            style={{flex: 1}}
            actions={contextMenuActions}
            onPress={(e) => onContextMenuPressed(e, data, chatType)}
            disabled={attachments.length > 1}>
            <View style={styles.radius8}>
              <View style={textContainerStyle(true, chatType)}>
                {isShowUserInfo && (
                  <View style={styles.chatTitleContainer}>
                    <Text style={[styles.userText, textStyle(true)]}>{username}</Text>
                    <View style={dotStyle(true)} />
                    <Text testID="timestamp" style={[styles.timeText, textStyle(true)]}>
                      {calculateTime(time, true)}
                    </Text>
                  </View>
                )}
                {attachments.length > 0 && messageType !== 'deleted' && (
                  <View
                    style={[
                      styles.attachmentContainer,
                      attachments?.find((item) => item.type === 'file') ? {height: 'auto'} : {}
                    ]}>
                    {attachments
                      .filter((item, index) => index <= 3)
                      .map((item, index) =>
                        item.type === 'file' ? (
                          <TouchableOpacity
                            key={index}
                            style={{flex: 1}}
                            activeOpacity={1}
                            onPress={() => Linking.openURL(item.file_path)}>
                            <View style={styles.attachmentFileContainer}>
                              <View style={styles.attachmentFileContent}>
                                <Text style={styles.attachmentFileName}>{item.file_name}</Text>
                                <View>
                                  <Text style={styles.attachmentFileInfo}>
                                    {formatBytes(item.file_size)} •{' '}
                                    {item.file_name
                                      ?.split('.')
                                      [item.file_name?.split('.')?.length - 1]?.toUpperCase()}
                                  </Text>
                                </View>
                              </View>
                              <View style={styles.attachmentFileIcon}>
                                <IconFile />
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            key={index}
                            style={{
                              width: `${
                                (attachments.length >= 3 && index > 0) || attachments.length >= 4
                                  ? 50
                                  : 100
                              }%`,
                              height: `${attachments.length >= 3 ? 50 : 100 / attachments.length}%`,
                              position: 'relative',
                              overflow: 'hidden'
                            }}
                            activeOpacity={1}
                            onPress={
                              attachments.length > 0 && item.type !== 'gif'
                                ? () => onOpenMediaPreview(attachments, index, navigation)
                                : null
                            }>
                            {item.type !== 'file' && (
                              <FastImage
                                style={styles.image}
                                source={{
                                  uri: item.thumb_url
                                }}
                              />
                            )}
                            {attachments.length > 4 && index === 3 && (
                              <View style={styles.moreOverlay}>
                                <Text style={styles.moreText}>+{attachments.length - 4}</Text>
                              </View>
                            )}
                            {/* Video Play Icon */}
                            {item.video_path && (
                              <View style={styles.moreOverlay}>
                                <IconVideoPlay />
                              </View>
                            )}
                          </TouchableOpacity>
                        )
                      )}
                  </View>
                )}

                <ChatReplyView
                  type={chatType}
                  messageType={messageType}
                  replyData={data?.reply_data}
                />

                <View style={{flexDirection: 'row'}}>
                  {attachments.length <= 0 && (
                    <Text style={messageStyle(true, messageType)}>{message}</Text>
                  )}
                  {renderIcon()}
                </View>
              </View>
            </View>
          </ContextMenu>

          {renderAvatar()}
        </Animated.View>
      </View>
    </Swipeable>
  );
};

export default React.memo(ChatItemMyTextV2);
