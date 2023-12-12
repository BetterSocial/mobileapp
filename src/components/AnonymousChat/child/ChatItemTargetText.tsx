// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import ContextMenu from 'react-native-context-menu-view';
import Icon from 'react-native-vector-icons/Entypo';
import Animated, {withDelay, withSequence, withTiming} from 'react-native-reanimated';
import {Swipeable} from 'react-native-gesture-handler';
import {Text, View, ViewStyle} from 'react-native';

import ChatReplyView from './ChatReplyView';
import useMessageHook from '../../../hooks/screen/useMessageHook';
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
  const swipeableRef = React.useRef<Swipeable | null>(null);

  React.useEffect(() => {
    if (scrollContext?.selectedMessageId === data?.id) {
      pulseAnimation.value = withSequence(
        withDelay(300, withTiming(1.1, {duration: 200})),
        withTiming(1, {duration: 200})
      );
      scrollContext?.setSelectedMessageId(null);
    }
  }, [scrollContext?.selectedMessageId]);

  const isReply = messageType === 'reply';
  const isReplyPrompt = messageType === 'reply_prompt';
  const isShowUserInfo = !isContinuous || isReplyPrompt || isReply;

  const contextMenuActions = [
    {title: 'Reply', systemIcon: 'arrow.turn.up.left'},
    {title: 'Copy Message', systemIcon: 'square.on.square'}
  ];

  const renderAvatar = React.useCallback(() => {
    if (!isShowUserInfo) return <View style={styles.avatar} />;
    return <View style={styles.mrBuble}>{avatar}</View>;
  }, []);

  const onSwipeToReply = (direction) => {
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
  };

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
