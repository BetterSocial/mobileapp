/* eslint-disable @typescript-eslint/no-explicit-any */
import {Alert, NativeSyntheticEvent} from 'react-native';
import {ContextMenuOnPressNativeEvent} from 'react-native-context-menu-view';
import {useCallback, useContext} from 'react';

import ChatSchema from '../../database/schema/ChatSchema';
import ShareUtils from '../../utils/share';
import UseMessageHook from '../../../types/hooks/screens/useMessageHook.types';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import {Context} from '../../context';
import {setReplyTarget} from '../../context/actions/chat';

function useMessageHook(): UseMessageHook {
  const {localDb, refresh} = useLocalDatabaseHook();
  const [replyPreview, dispatch] = (useContext(Context) as unknown as any).chat;

  const setReplyPreview = useCallback((messageItem) => {
    console.log('Reply Message');
    setReplyTarget(messageItem, dispatch);
  }, []);

  const clearReplyPreview = useCallback(() => {
    console.log('clear Reply target');
    setReplyTarget(null, dispatch);
  }, []);

  const deleteMessage = (messageId: string) => {
    if (!localDb) return;
    try {
      ChatSchema.updateDeletedChatType(localDb, messageId);
      refresh('chat');
    } catch (error) {
      console.log('error on delete message:', error);
    }
  };

  const onContextMenuPressed = (
    e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>,
    messageId: string,
    message: string
  ) => {
    const event = e.nativeEvent;
    if (event.index === 0) {
      const messageItem = {
        username: 'Anonymous User',
        time: '4h',
        message: 'sdfgsdMollit esse ea anim exercitation irure quis nostrud est.',
        messageId: 'sdfs',
        chatType: '',
        messageType: 'regular'
      };
      setReplyPreview(messageItem);
    }
    if (event.index === 1) {
      ShareUtils.copyTextToClipboard(message);
    }
    if (event.index === 2) {
      Alert.alert('Delete Message?', '', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Confirm', style: 'destructive', onPress: () => deleteMessage(messageId)}
      ]);
    }
  };

  return {
    replyPreview: replyPreview?.replyTarget,
    setReplyPreview,
    clearReplyPreview,
    onContextMenuPressed
  };
}

export default useMessageHook;
