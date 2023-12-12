/* eslint-disable @typescript-eslint/no-explicit-any */
import {Alert, NativeSyntheticEvent} from 'react-native';
import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {useAnimatedStyle, useSharedValue} from 'react-native-reanimated';
import {useCallback, useContext} from 'react';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChatSchema from '../../database/schema/ChatSchema';
import ShareUtils from '../../utils/share';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import useChatUtilsHook from '../core/chat/useChatUtilsHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {Context} from '../../context';
import {ReplyMessage, UseMessageHook} from '../../../types/hooks/screens/useMessageHook.types';
import {setReplyTarget} from '../../context/actions/chat';

function useMessageHook(): UseMessageHook {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {selectedChannel} = useChatUtilsHook();
  const [replyPreview, dispatch] = (useContext(Context) as unknown as any).chat;
  const {anon_user_info_emoji_name} = selectedChannel?.rawJson?.channel || {};
  const bubblePosition = useSharedValue(0);
  const pulseAnimation = useSharedValue(1);

  const setReplyPreview = useCallback((messageItem) => {
    setReplyTarget(messageItem, dispatch);
  }, []);

  const clearReplyPreview = useCallback(() => {
    setReplyTarget(null, dispatch);
  }, []);

  const deleteMessage = async (messageId: string, type: 'ANONYMOUS' | 'SIGNED') => {
    if (!localDb) return;
    try {
      if (type === 'ANONYMOUS') {
        await AnonymousMessageRepo.deleteMessage(messageId);
      } else {
        await SignedMessageRepo.deleteMessage(messageId);
      }
      ChatSchema.updateDeletedChatType(localDb, messageId);
      refresh('chat');
    } catch (error) {
      console.log('error on delete message:', error);
    }
  };

  const getUserName = (item): string => {
    if (item?.user?.username !== 'AnonymousUser') {
      return item?.user?.username;
    }
    return `Anonymous ${anon_user_info_emoji_name}`;
  };

  const onContextMenuPressed = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    data,
    type: 'ANONYMOUS' | 'SIGNED'
  ) => {
    const event = e.nativeEvent;
    data = data?.message?.user ? data?.message : data;

    if (event.index === 0) {
      const messageItem: ReplyMessage = {
        id: data?.id ?? data?.message?.id,
        user: {username: getUserName(data)},
        message: data?.text ?? data?.message,
        message_type: data?.message_type ?? data?.message?.message_type,
        updated_at: data?.updated_at ?? data?.message?.updated_at,
        chatType: type
      };
      setReplyPreview(messageItem);
    }
    if (event.index === 1) {
      const isDeleted = data?.message_type === 'deleted';
      const message = data?.text ?? data?.message;
      const textToCopy = isDeleted ? '' : message;
      ShareUtils.copyTextToClipboard(textToCopy);
    }
    if (event.index === 2) {
      Alert.alert('Delete Message?', '', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', style: 'destructive', onPress: () => deleteMessage(data?.id, type)}
      ]);
    }
  };

  const animatedBubbleStyle = useAnimatedStyle(() => {
    'worklet';

    return {transform: [{translateX: bubblePosition.value}]};
  });

  const animatedPulseStyle = useAnimatedStyle(() => {
    'worklet';

    return {transform: [{scale: pulseAnimation.value}]};
  });

  return {
    replyPreview: replyPreview?.replyTarget,
    setReplyPreview,
    clearReplyPreview,
    onContextMenuPressed,
    bubblePosition,
    pulseAnimation,
    animatedBubbleStyle,
    animatedPulseStyle
  };
}

export default useMessageHook;
