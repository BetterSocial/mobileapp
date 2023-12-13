// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import ContextMenu from 'react-native-context-menu-view';
import {Animated, Text, TouchableOpacity, View} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import FastImage from 'react-native-fast-image';

import {useNavigation} from '@react-navigation/core';
import ChatReplyView from './ChatReplyView';
import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import IconVideoPlay from '../../../assets/icon/IconVideoPlay';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
import {ChatStatus} from '../../../../types/database/schema/ChannelList.types';
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
  const {setReplyPreview, onContextMenuPressed, onOpenMediaPreview} = useMessageHook();

  const swipeableRef = React.useRef<Swipeable | null>(null);
  const bubblePosition = useSharedValue(0);

  const isReply = messageType === 'reply';
  const isReplyPrompt = messageType === 'reply_prompt';
  const isShowUserInfo = !isContinuous || isReplyPrompt || isReply;

  const animatedBubbleStyle = useAnimatedStyle(() => ({
    transform: [{translateX: bubblePosition.value}]
  }));

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
  }, []);

  const contextMenuActions = [
    {title: 'Reply', systemIcon: 'arrow.turn.up.left'},
    {title: 'Copy Message', systemIcon: 'square.on.square'},
    {title: 'Delete Message', systemIcon: 'trash', destructive: true}
  ];

  const renderAvatar = React.useCallback(() => {
    if (!isShowUserInfo) return <View style={styles.avatar} />;
    return <View style={styles.ml8}>{avatar}</View>;
  }, []);

  const onSwipeToReply = (direction) => {
    if (direction === 'right') return;
    if (swipeableRef.current) swipeableRef.current?.close();
    setReplyPreview({
      username,
      time,
      message,
      messageId: data?.id,
      chatType,
      messageType: 'regular',
      attachments
    });
  };

  return (
    <Swipeable
      testID="swipeable"
      ref={swipeableRef}
      friction={3}
      overshootFriction={2}
      onSwipeableOpen={onSwipeToReply}
      renderLeftActions={replyIcon}>
      <View style={containerStyle(true, isReplyPrompt)}>
        <Animated.View style={[styles.wrapper, animatedBubbleStyle]}>
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
                    <Text style={[styles.timeText, textStyle(true)]}>{time}</Text>
                  </View>
                )}
                {attachments.length > 0 && messageType !== 'deleted' && (
                  <View style={styles.attachmentContainer}>
                    {attachments
                      .filter((item, index) => index <= 3)
                      .map((item, index) => (
                        <TouchableOpacity
                          key={item.thumb_url}
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
                            attachments.length > 0
                              ? () => onOpenMediaPreview(attachments, index, navigation)
                              : null
                          }>
                          <FastImage
                            style={styles.image}
                            source={{
                              uri: item.thumb_url
                            }}
                          />
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
                      ))}
                  </View>
                )}

                <ChatReplyView
                  type={chatType}
                  messageType={messageType}
                  replyData={data?.reply_data}
                />

                <View style={{flexDirection: 'row'}}>
                  {message?.trim() !== '' && (
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
