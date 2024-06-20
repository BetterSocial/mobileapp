import * as React from 'react';
import ContextMenu, {
  ContextMenuAction,
  ContextMenuOnPressNativeEvent
} from 'react-native-context-menu-view';
import {Alert, NativeSyntheticEvent} from 'react-native';

import ChatSchema from '../../database/schema/ChatSchema';
import ShareUtils from '../../utils/share';
import useMessageHook from '../../hooks/core/chat/useMessageHook';
import {COLORS} from '../../utils/theme';

type BetterSocialContextMenuType = 'MyChatContextMenu' | 'TargetChatContextMenu';
type BetterSocialContextMenuName = 'Copy' | 'Delete' | 'Reply';
type BetterSocialContextMenuAction = ContextMenuAction & {title: BetterSocialContextMenuName};
type BetterSocialContextMenuOnPressNativeEvent = ContextMenuOnPressNativeEvent & {
  name: BetterSocialContextMenuName;
};

type ChatContextMenuViewProps = {
  children: React.ReactNode;
  contextMenuType: BetterSocialContextMenuType;
  chat?: ChatSchema;
};

const MyChatContextMenu: BetterSocialContextMenuAction[] = [
  {title: 'Copy', systemIcon: 'square.on.square'},
  {title: 'Delete', systemIcon: 'trash', destructive: true}
];

const DeletedChatContextMenu: BetterSocialContextMenuAction[] = [];

const TargetChatContextMenu: BetterSocialContextMenuAction[] = [
  {title: 'Copy', systemIcon: 'square.on.square'}
];

const ChatContextMenuView = ({children, contextMenuType, chat}: ChatContextMenuViewProps) => {
  const {copyMessage, deleteMessage} = useMessageHook(chat);

  let contextMenuActions = MyChatContextMenu;
  if (contextMenuType === 'TargetChatContextMenu') {
    contextMenuActions = TargetChatContextMenu;
  }

  if (chat?.type === 'deleted') {
    contextMenuActions = DeletedChatContextMenu;
  }

  const onContextMenuPressed = (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    const event = e?.nativeEvent as BetterSocialContextMenuOnPressNativeEvent;

    if (event.name === 'Copy') {
      copyMessage();
    } else if (event.name === 'Delete') {
      Alert.alert('Delete Message?', '', [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Delete', style: 'destructive', onPress: () => deleteMessage(0)}
      ]);
    }
  };

  return (
    <ContextMenu
      previewBackgroundColor={COLORS.transparent}
      style={{flex: 1}}
      actions={contextMenuActions}
      onPress={onContextMenuPressed}>
      {children}
    </ContextMenu>
  );
};

export default ChatContextMenuView;
