export interface CreatedBy {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  banned: boolean;
  online: boolean;
  image: string;
  name: string;
}

export interface User {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  banned: boolean;
  online: boolean;
  image: string;
  name: string;
  username?: string;
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
  anon_user_info_color_code?: string;
  anon_user_info_color_name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_emoji_name?: string;
}

export interface Message {
  id: string;
  text: string;
  other_text?: string;
  html: string;
  type: string;
  user: User;
  attachments: any[];
  latest_reactions: any[];
  own_reactions: any[];
  reaction_counts: any;
  reaction_scores: any;
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
  anon_user_info_color_name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_emoji_name?: string;
  members?: string[];
  message?: string;
  anon_user_info_color_code?: string;
  __html: string;
  status: string;
  channelId?: string;
}

export interface ChannelData {
  id: string;
  type: string;
  cid: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  created_by: CreatedBy;
  frozen: boolean;
  disabled: boolean;
  member_count: number;
  hidden: boolean;
  members: Member[];
  messages: Message[];
  targetName: string;
  targetImage: string;
  firstMessage: Message;
}
