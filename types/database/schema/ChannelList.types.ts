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
  rawJson: any;
  user: UserSchema | null;
}

export interface ChatSchema {
  id: string;
  channelId: string;
  userId: string;
  message: string;
  type: string;
  createdAt: string;
  updatedAt: string;
  rawJson: string;
  user: UserSchema | null;
}
