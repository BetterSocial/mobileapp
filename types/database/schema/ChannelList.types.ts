/* eslint-disable no-shadow */
import {ChatListDetail} from './ChatListDetail.types';

export interface UserSchema {
  id: string;
  username: string;
  countryCode: string;
  createdAt: string;
  updatedAt: string;
  lastActiveAt: string;
  profilePicture: string;
  bio: string;
  isBanned: boolean;
  isMe: boolean;
  image?: string;
}

export interface ChannelListMemberSchema {
  id: string;
  channelId: string;
  userId: string;
  isModerator: boolean;
  isBanned: boolean;
  isShadowBanned: boolean;
  joinedAt: string;
  user: UserSchema | null;
}
export interface ChannelList {
  id: string;
  channelPicture: string;
  name: string;
  description: string;
  unreadCount: number;
  channelType: string;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  createdAt: string;
  expiredAt: string;
  rawJson: any;
  user: UserSchema | null;
  members: ChannelListMemberSchema[] | null;
  setRead: (db: any) => Promise<void>;
}

export interface ChatSchema {
  id: string;
  channelId: string;
  userId: string;
  message: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  rawJson: ChatListDetail | null;
  user: UserSchema | null;
  status: string;
  isMe: boolean;
  isContinuous: boolean;
}

export enum ChatStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}
