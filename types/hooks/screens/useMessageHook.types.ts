import Animated from 'react-native-reanimated';
import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {NativeSyntheticEvent} from 'react-native';

export type MessageType = 'regular' | 'reply' | 'reply_prompt' | 'deleted';

interface AnimatedStyle {
  transform: Array<{translateX?: number; scale?: number}>;
}

export interface ReplyUser {
  name?: string;
  username: string;
}

export interface ReplyMessage {
  id: string;
  user: ReplyUser;
  message: string;
  text?: string;
  message_type: MessageType;
  updated_at: string;
  chatType?: 'ANONYMOUS' | 'SIGNED';
}

export interface UseMessageHook {
  replyPreview: ReplyMessage | null;
  setReplyPreview: (data: ReplyMessage) => void;
  clearReplyPreview: () => void;
  onContextMenuPressed: (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    data: any,
    type: 'ANONYMOUS' | 'SIGNED'
  ) => void;
  bubblePosition: Animated.SharedValue<number>;
  pulseAnimation: Animated.SharedValue<number>;
  animatedBubbleStyle: AnimatedStyle;
  animatedPulseStyle: AnimatedStyle;
}
