import SimpleToast from 'react-native-simple-toast';
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
import {DELETED_MESSAGE_TEXT, MESSAGE_TYPE_DELETED} from '../../utils/constants';
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

  const getUserName = (item): string => {
    if (item?.user?.username !== 'AnonymousUser') {
      return item?.user?.username;
    }
    return `Anonymous ${anon_user_info_emoji_name}`;
  };

  const replyMessage = useCallback((data, type: 'ANONYMOUS' | 'SIGNED') => {
    const messageItem: ReplyMessage = {
      id: data?.id ?? data?.message?.id,
      user: {username: getUserName(data)},
      message: data?.text ?? data?.message,
      message_type: data?.message_type ?? data?.message?.message_type,
      updated_at: data?.updated_at ?? data?.message?.updated_at,
      chatType: type
    };
    setReplyPreview(messageItem);
  }, []);

  const copyMessage = useCallback((data) => {
    const isDeleted = data?.message_type === MESSAGE_TYPE_DELETED;
    const message = data?.text ?? data?.message;
    const textToCopy = isDeleted ? '' : message;
    ShareUtils.copyTextToClipboard(textToCopy);
  }, []);

  const deleteMessage = async (messageId: string, type: 'ANONYMOUS' | 'SIGNED', iteration = 0) => {
    if (!localDb) return;

    if (iteration > 5) {
      SimpleToast.show("Can't delete message, please check your connection");
      return;
    }

    try {
      ChatSchema.updateDeletedChatType(localDb, messageId);
      refresh('chat');

      const {replyTarget} = replyPreview;
      if (replyTarget && replyTarget?.id === messageId) {
        const newReplyPreview = {...replyTarget};
        newReplyPreview.message = DELETED_MESSAGE_TEXT;
        newReplyPreview.message_type = 'deleted';
        setReplyPreview(newReplyPreview);
      }

      if (type === 'ANONYMOUS') {
        await AnonymousMessageRepo.deleteMessage(messageId);
      } else {
        await SignedMessageRepo.deleteMessage(messageId);
      }
    } catch (error) {
      console.log('error on delete message:', error);
      setTimeout(() => {
        deleteMessage(messageId, type, iteration + 1).catch((e) => console.log(e));
      }, 1000);
    }
  };

  const onContextMenuPressed = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    data,
    type: 'ANONYMOUS' | 'SIGNED'
  ) => {
    const event = e.nativeEvent;
    data = data?.message?.user ? data?.message : data;

    if (event.index === 0) {
      replyMessage(data, type);
    }
    if (event.index === 1) {
      copyMessage(data);
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
