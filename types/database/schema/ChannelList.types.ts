/* eslint-disable no-shadow */
import {SQLiteDatabase} from 'react-native-sqlite-storage';

import {ChatListDetail} from './ChatListDetail.types';
import {SQLiteBoolean} from '../../../src/database/schema/UserSchema';

export interface UserSchema {
  userId?: string;
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
  anon_user_info_emoji_name: string | null;
  anon_user_info_emoji_code: string | null;
  anon_user_info_color_name: string | null;
  anon_user_info_color_code: string | null;
  isAnonymous: SQLiteBoolean | null;
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

export type BetterSocialChannelType =
  | 'PM'
  | 'GROUP'
  | 'ANON_PM'
  | 'POST_NOTIFICATION'
  | 'ANON_POST_NOTIFICATION'
  | 'TOPIC'
  | 'ANON_TOPIC';

export interface ChannelList {
  id: string;
  channelPicture: string;
  name: string;
  description: string;
  unreadCount: number;
  channelType: BetterSocialChannelType;
  lastUpdatedAt: string;
  lastUpdatedBy: string;
  createdAt: string;
  expiredAt: string;
  rawJson: any;
  user: UserSchema | null;
  members: ChannelListMemberSchema[] | null;
  memberUsers: UserSchema[] | null;
  setRead: (db: any) => Promise<void>;
  anon_user_info_emoji_name: string | null;
  anon_user_info_emoji_code: string | null;
  anon_user_info_color_code: string | null;
  anon_user_info_color_name: string | null;
  topicPostExpiredAt: string | null;
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
  getById: (db: SQLiteDatabase, id: string) => Promise<ChatSchema>;
}

export enum ChatStatus {
  PENDING = 'pending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read'
}
