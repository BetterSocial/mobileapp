export type WebsocketUserDataType = {
  userId: string;
  token: string;
  isAnonymous: boolean;
  name?: string;
  image?: string;
};

export type GetstreamMessage = {
  attachments: any[];
  cid: string;
  created_at: string;
  html: string;
  id: string;
  latest_reactions: any[];
  mentioned_users: any[];
  own_reactions: any[];
  pin_expires: any;
  pinned: boolean;
  pinned_at: any;
  pinned_by: any;
  reaction_counts: any;
  reaction_scores: any;
  reply_count: number;
  shadowed: boolean;
  silent: boolean;
  text: string;
  isSystem?: boolean;
  textOwnMessage?: string;
  type: string;
  updated_at: string;
  user: {
    banned: boolean;
    created_at: string;
    id: string;
    image: string;
    last_active: string;
    name: string;
    online: boolean;
    role: string;
    updated_at: string;
    username: string;
  };
};

export type GetstreamChannel = {
  channel_type: number;
  channel_image?: string;
  cid: string;
  config: {
    automod: string;
    automod_behavior: string;
    commands: any[];
    connect_events: boolean;
    created_at: string;
    custom_events: boolean;
    mark_messages_pending: boolean;
    max_message_length: number;
    message_retention: string;
    mutes: boolean;
    name: string;
    push_notifications: boolean;
    quotes: boolean;
    reactions: boolean;
    read_events: boolean;
    reminders: boolean;
    replies: boolean;
    search: boolean;
    typing_events: boolean;
    updated_at: string;
    uploads: boolean;
    url_enrichment: boolean;
  };
  created_at: string;
  created_by: {
    banned: boolean;
    created_at: string;
    id: string;
    image: string;
    last_active: string;
    name: string;
    online: boolean;
    role: string;
    updated_at: string;
    username: string;
  };
  disabled: boolean;
  frozen: boolean;
  id: string;
  last_message_at: string;
  member_count: number;
  members: any[];
  better_channel_members: any[];
  better_channel_member: any[];
  name: string;
  type: string;
  updated_at: string;
  anon_user_info_emoji_name?: string;
  anon_user_info_color_name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_color_code?: string;
};

export type GetstreamWebsocket = {
  channel: GetstreamChannel;
  channel_id: string;
  channel_type: string;
  cid: string;
  created_at: string;
  message: GetstreamMessage;
  total_unread_count: number;
  type: string;
  unread_channels: number;
  unread_count: number;
  isAnonymous?: boolean;
  anon_user_info_emoji_name?: string;
  anon_user_info_color_name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_color_code?: string;
  // Custom Param
  targetName: string;
  targetImage?: string;
  originalMembers?: any[];
};

export type MyChannelType = 'SIGNED' | 'ANONYMOUS';
