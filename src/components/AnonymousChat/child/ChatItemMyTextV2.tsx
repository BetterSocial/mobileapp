// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import Animated, {withDelay, withSequence, withTiming} from 'react-native-reanimated';
import ContextMenu, {ContextMenuAction} from 'react-native-context-menu-view';
import {
  Dimensions,
  NativeSyntheticEvent,
  Text,
  TextLayoutEventData,
  View,
  ViewStyle
} from 'react-native';
import {Swipeable} from 'react-native-gesture-handler';

import ChatReplyView from './ChatReplyView';
import IconChatCheckMark from '../../../assets/icon/IconChatCheckMark';
import IconChatClockGrey from '../../../assets/icon/IconChatClockGrey';
import useMessageHook from '../../../hooks/screen/useMessageHook';
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
  targetLastLine,
  textContainerStyle,
  textStyle
} from './ChatItemText.style';
import {replyIcon} from './ChatItemTargetText';

const {width} = Dimensions.get('screen');
const targetLastLineWidth = width - targetLastLine;

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

  const swipeableRef = React.useRef<Swipeable | null>(null);
  const [isNewLine, setIsNewLine] = React.useState(true);

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

  const onTextLayout = (event: NativeSyntheticEvent<TextLayoutEventData>) => {
    const {lines} = event.nativeEvent;
    const lastLine = lines[lines.length - 1];
    const lastLineWidth = lastLine?.width;
    const isCalculatedNewLine = targetLastLineWidth - lastLineWidth < 24;
    setIsNewLine(isCalculatedNewLine);
  };

  const renderIcon = React.useCallback(() => {
    if (status === ChatStatus.PENDING)
      return (
        <View style={styles.icon}>
          <IconChatClockGrey color={colors.silver} width={12} height={12} />
        </View>
      );

    return (
      <View style={styles.icon}>
        <IconChatCheckMark color={colors.silver} />
      </View>
    );
  }, []);

  const contextMenuActions: ContextMenuAction[] = [
    {title: 'Reply', systemIcon: 'arrow.turn.up.left'},
    {title: 'Copy Message', systemIcon: 'square.on.square'}
  ];

  if (messageType !== 'deleted') {
    contextMenuActions.push({title: 'Delete Message', systemIcon: 'trash', destructive: true});
  }

  const renderAvatar = React.useCallback(() => {
    if (!isShowUserInfo) return <View style={styles.avatar} />;
    return <View style={styles.mlBuble}>{avatar}</View>;
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
              <View style={textContainerStyle(true, chatType, isNewLine)}>
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

                <Text style={messageStyle(true, messageType)} onTextLayout={onTextLayout}>
                  {`${message}`}
                </Text>

                {renderIcon()}
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
