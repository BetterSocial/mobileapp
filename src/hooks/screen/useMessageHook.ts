/* eslint-disable @typescript-eslint/no-explicit-any */
import {Alert, NativeSyntheticEvent} from 'react-native';
import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {useCallback, useContext} from 'react';

import AnonymousMessageRepo from '../../service/repo/anonymousMessageRepo';
import ChatSchema from '../../database/schema/ChatSchema';
import ShareUtils from '../../utils/share';
import SignedMessageRepo from '../../service/repo/signedMessageRepo';
import UseMessageHook from '../../../types/hooks/screens/useMessageHook.types';
import useChatScreenHook from './useChatScreenHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {ANONYMOUS} from '../core/constant';
import {Context} from '../../context';
import {calculateTime} from '../../utils/time';
import {setReplyTarget} from '../../context/actions/chat';

function useMessageHook(): UseMessageHook {
  const {localDb, refresh} = useLocalDatabaseHook();
  const {handleUserName} = useChatScreenHook(ANONYMOUS);
  const [replyPreview, dispatch] = (useContext(Context) as unknown as any).chat;

  const setReplyPreview = useCallback((messageItem) => {
    console.log('Reply Message');
    setReplyTarget(messageItem, dispatch);
  }, []);

  const clearReplyPreview = useCallback(() => {
    console.log('clear Reply target');
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

  const onContextMenuPressed = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    data,
    type: 'ANONYMOUS' | 'SIGNED'
  ) => {
    const event = e.nativeEvent;
    data = data?.message?.user ? data?.message : data;

    if (event.index === 0) {
      const messageItem = {
        username: handleUserName(data),
        time: calculateTime(data?.updated_at, true),
        message: data?.message ?? data?.text,
        messageId: data?.id,
        chatType: type,
        messageType: 'regular',
        attachments: data?.attachments
      };
      setReplyPreview(messageItem);
    }
    if (event.index === 1) {
      ShareUtils.copyTextToClipboard(data?.message);
    }
    if (event.index === 2) {
      Alert.alert('Delete Message?', '', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', style: 'destructive', onPress: () => deleteMessage(data?.id, type)}
      ]);
    }
  };

  const onOpenMediaPreview = (medias, index, navigation) => {
    if (medias.find((media) => media.type === 'video')) {
      navigation.push('VideoViewer', {
        title: 'Video',
        url: medias[index].video_path
      });
    } else {
      navigation.push('ImageViewer', {
        title: 'Photo',
        index,
        images: medias
          .filter((media) => media.type === 'photo')
          .map((media) => ({url: media.asset_url}))
      });
    }
  };

  return {
    replyPreview: replyPreview?.replyTarget,
    setReplyPreview,
    clearReplyPreview,
    onContextMenuPressed,
    onOpenMediaPreview
  };
}

export default useMessageHook;
