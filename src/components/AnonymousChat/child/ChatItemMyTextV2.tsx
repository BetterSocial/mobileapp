// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import Animated, {withDelay, withSequence, withTiming} from 'react-native-reanimated';
import ContextMenu, {ContextMenuAction} from 'react-native-context-menu-view';
import {Swipeable} from 'react-native-gesture-handler';
import {Text, View, ViewStyle} from 'react-native';

import ChatReplyView from './ChatReplyView';
import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
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

const ChatItemMyTextV2 = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  status = ChatStatus.PENDING,
  avatar,
  chatType,
  messageType,
  data
}: ChatItemMyTextProps) => {
  const {
    setReplyPreview,
    onContextMenuPressed,
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
        <View style={styles.icon}>
          <IconChatClockGrey color={colors.silver} width={12} height={12} />
        </View>
      );

    return (
      <View style={styles.icon}>
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
        chatType
      });
    },
    [data, username, time, message, messageType, chatType]
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
            onPress={(e) => onContextMenuPressed(e, data, chatType)}>
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

                <ChatReplyView
                  type={chatType}
                  messageType={messageType}
                  replyData={data?.reply_data}
                />

                <View style={{flexDirection: 'row'}}>
                  <Text style={messageStyle(true, messageType)}>{message}</Text>
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
