import ChatSchema from '../../../src/database/schema/ChatSchema';
import {Anonimity} from './BaseChannelItem.types';
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
  attachments?: any;
  type?: BaseChatItemTypeProps;
  chatItem?: ChatSchema;
}

export interface ChatItemMyTextProps extends BaseChatItemProps {
  status?: ChatStatus;
  chatType: Anonimity;
}

export interface ChatItemTargetText extends BaseChatItemProps {
  type?: BaseChatItemTypeProps.ANON_CHAT;
}

export interface BaseChatItemComponentProps {
  item?: ChatSchema;
  index?: number;
  type: Anonimity;
  messageSingle?: string;
  componentType?: 'SINGLE' | 'GROUP';
}
