export interface Command {
  name: string;
  description: string;
  args: string;
  set: string;
}

export interface Config {
  created_at: string;
  updated_at: string;
  name: string;
  typing_events: boolean;
  read_events: boolean;
  connect_events: boolean;
  search: boolean;
  reactions: boolean;
  replies: boolean;
  quotes: boolean;
  mutes: boolean;
  uploads: boolean;
  url_enrichment: boolean;
  custom_events: boolean;
  push_notifications: boolean;
  reminders: boolean;
  message_retention: string;
  max_message_length: number;
  automod: string;
  automod_behavior: string;
  commands: Command[];
}

export interface User {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  banned: boolean;
  online: boolean;
  name: string;
  image: string;
  username: string;
}

export interface Message {
  id: string;
  text: string;
  html: string;
  type: string;
  user: User;
  attachments: any[];
  latest_reactions: any[];
  own_reactions: any[];
  reaction_counts: any[];
  reaction_scores: any[];
  reply_count: number;
  cid: string;
  created_at: string;
  updated_at: string;
  shadowed: boolean;
  mentioned_users: any[];
  silent: boolean;
  pinned: boolean;
  pinned_at: any;
  pinned_by: any;
  pin_expires: any;
  message: string;
  channelId: string;
}

export interface Member {
  user_id: string;
  user: User;
  created_at: string;
  updated_at: string;
  banned: boolean;
  shadow_banned: boolean;
  role: string;
  channel_role: string;
}

export interface Channel {
  id: string;
  type: string;
  cid: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  created_by: User;
  frozen: boolean;
  disabled: boolean;
  members: Member[];
  member_count: number;
  config: Config;
}

export interface ChatListDetail {
  type: string;
  cid: string;
  channel_id: string;
  channel_type: string;
  message: Message;
  channel: Channel;
  created_at: string;
  unread_count: number;
  total_unread_count: number;
  unread_channels: number;
  targetName: string;
  targetImage: string;
}
