import React from 'react';
import {FlatList} from 'react-native';

import ChatSchema from '../../../src/database/schema/ChatSchema';
import UserSchema from '../../../src/database/schema/UserSchema';
import {ChannelList} from '../../database/schema/ChannelList.types';

interface UseChatScreenHook {
  chats: ChatSchema[];
  goBackFromChatScreen: () => void;
  goToChatInfoScreen: (params?: any) => void;
  sendChat: (message: string, attachments: any) => Promise<void>;
  selectedChannel: ChannelList;
  handleUserName: (item: ChatSchema) => string;
  updateChatContinuity: (chatsData: ChatSchema[]) => ChatSchema[];
  flatListRef: React.RefObject<FlatList>;
  selfAnonUserInfo: UserSchema | null;
  scrollContext: {
    selectedMessageId: string | null;
    setSelectedMessageId: (messageId: string | null) => void;
    handleScrollTo: (messageId: string) => void;
  };
  loadingChat: boolean;
}

export default UseChatScreenHook;
