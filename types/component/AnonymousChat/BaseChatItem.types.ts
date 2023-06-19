/* eslint-disable no-shadow */
export enum BaseChatItemTypeProps {
  MY_ANON_CHAT = 'MY_ANON_CHAT',
  MY_ANON_REPLY_CHAT = 'MY_ANON_REPLY_CHAT',
  MY_ANON_LINK_CHAT = 'MY_ANON_LINK_CHAT',
  ANON_CHAT = 'ANON_CHAT',
  ANON_REPLY_CHAT = 'ANON_REPLY_CHAT',
  ANON_LINK_CHAT = 'ANON_LINK_CHAT'
}

export interface BaseChatItemProps {
  avatar: string;
  username: string;
  time: string;
  isContinuous: boolean;
  message: string;
  type?: BaseChatItemTypeProps;
}

export interface ChatItemMyTextProps extends BaseChatItemProps {
  type?: BaseChatItemTypeProps.MY_ANON_CHAT;
}

export interface ChatItemTargetText extends BaseChatItemProps {
  type?: BaseChatItemTypeProps.ANON_CHAT;
}
