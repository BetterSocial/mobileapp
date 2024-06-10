import * as React from 'react';
import ContextMenu, {
  ContextMenuAction,
  ContextMenuOnPressNativeEvent
} from 'react-native-context-menu-view';
import {NativeSyntheticEvent} from 'react-native';

import ShareUtils from '../../utils/share';
import {COLORS} from '../../utils/theme';

type BetterSocialContextMenuType = 'MyChatContextMenu' | 'TargetChatContextMenu';
type BetterSocialContextMenuName = 'Copy' | 'Delete' | 'Reply';
type BetterSocialContextMenuAction = ContextMenuAction & {title: BetterSocialContextMenuName};
type BetterSocialContextMenuOnPressNativeEvent = ContextMenuOnPressNativeEvent & {
  name: BetterSocialContextMenuName;
};

type ChatContextMenuViewProps = {
  children: React.ReactNode;
  message: string;
  contextMenuType: BetterSocialContextMenuType;
};

const MyChatContextMenu: BetterSocialContextMenuAction[] = [
  {title: 'Copy', systemIcon: 'square.on.square'}
  //   {title: 'Delete', systemIcon: 'trash', destructive: true}
];

const TargetChatContextMenu: BetterSocialContextMenuAction[] = [
  {title: 'Copy', systemIcon: 'square.on.square'}
];

const ChatContextMenuView = ({children, message, contextMenuType}: ChatContextMenuViewProps) => {
  let contextMenuActions = MyChatContextMenu;
  if (contextMenuType === 'TargetChatContextMenu') {
    contextMenuActions = TargetChatContextMenu;
  }

  const onContextMenuPressed = (e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    console.log('context menu pressed', message);
    const event = e?.nativeEvent as BetterSocialContextMenuOnPressNativeEvent;

    if (event.name === 'Copy') {
      ShareUtils.copyMessageWithoutLink(message);
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
