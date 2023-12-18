// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import Icon from 'react-native-vector-icons/Entypo';
import Animated, {withDelay, withSequence, withTiming} from 'react-native-reanimated';
import ContextMenu, {ContextMenuAction} from 'react-native-context-menu-view';
import {Swipeable} from 'react-native-gesture-handler';
import {Text, View, ViewStyle} from 'react-native';

import ChatReplyView from './ChatReplyView';
import useMessageHook from '../../../hooks/screen/useMessageHook';
import {
  CONTEXT_MENU_COPY,
  CONTEXT_MENU_REPLY,
  MESSAGE_TYPE_DELETED,
  MESSAGE_TYPE_REPLY,
  MESSAGE_TYPE_REPLY_PROMPT
} from '../../../utils/constants';
import {ChatItemMyTextProps} from '../../../../types/component/AnonymousChat/BaseChatItem.types';
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

export const replyIcon = () => {
  return (
    <View style={styles.containerReply}>
      <View style={styles.containerReplyIcon}>
        <Icon name={'reply'} size={20} color={colors.black} />
      </View>
    </View>
  );
};

const ChatItemTargetText = ({
  username = 'Anonymous User',
  time = '4h',
  isContinuous = false,
  message = '',
  attachments = [],
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

  const contextMenuActions: ContextMenuAction[] = [
    {title: CONTEXT_MENU_REPLY, systemIcon: 'arrow.turn.up.left'}
  ];

  if (messageType !== MESSAGE_TYPE_DELETED) {
    contextMenuActions.push({title: CONTEXT_MENU_COPY, systemIcon: 'square.on.square'});
  }

  const renderAvatar = React.useCallback(() => {
    if (!isShowUserInfo) return <View style={styles.avatar} />;
    return <View style={styles.mrBuble}>{avatar}</View>;
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
      <View style={containerStyle(false, isReplyPrompt)}>
        <Animated.View
          style={[
            styles.wrapper,
            animatedBubbleStyle as ViewStyle,
            animatedPulseStyle as ViewStyle
          ]}>
          {renderAvatar()}

          <ContextMenu
            previewBackgroundColor="transparent"
            style={{flex: 1}}
            actions={contextMenuActions}
            onPress={(e) => onContextMenuPressed(e, data, chatType)}>
            <View style={styles.radius8}>
              <View style={textContainerStyle(false)}>
                {isShowUserInfo && (
                  <View testID="chat-item-user-info" style={styles.chatTitleContainer}>
                    <Text style={[styles.userText, textStyle(false)]}>{username}</Text>
                    <View style={dotStyle(false)} />
                    <Text testID="timestamp" style={[styles.timeText, textStyle(false)]}>
                      {calculateTime(time, true)}
                    </Text>
                  </View>
                )}

                <ChatReplyView
                  type={chatType}
                  messageType={messageType}
                  replyData={data?.reply_data}
                />

                <Text testID="chat-item-message" style={messageStyle(false, messageType)}>
                  {message}
                </Text>
              </View>
            </View>
          </ContextMenu>
        </Animated.View>
      </View>
    </Swipeable>
  );
};

export default React.memo(ChatItemTargetText);
