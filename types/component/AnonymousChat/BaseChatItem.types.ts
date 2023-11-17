import ChatSchema from '../../../src/database/schema/ChatSchema';
import {ChatStatus} from '../../database/schema/ChannelList.types';

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
  avatar: React.ReactElement;
  username: string;
  time: string;
  isContinuous: boolean;
  message: string;
  type?: BaseChatItemTypeProps;
}

export interface ChatItemMyTextProps extends BaseChatItemProps {
  status?: ChatStatus;
  chatType?: string;
}

export interface ChatItemTargetText extends BaseChatItemProps {
  type?: BaseChatItemTypeProps.ANON_CHAT;
}

export interface BaseChatItemComponentProps {
  item?: ChatSchema;
  index?: number;
  type?: 'ANONYMOUS' | 'SIGNED';
  messageSingle?: string;
  componentType?: 'SINGLE' | 'GROUP';
}
