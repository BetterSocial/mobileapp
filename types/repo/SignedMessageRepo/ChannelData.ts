export interface GetAllSignedChannelsResponse {
  code: number;
  status: string;
  data: ChannelData[];
}

export interface ChannelData {
  id: string;
  type: string;
  cid: string;
  last_message_at: string;
  created_at: string;
  updated_at: string;
  created_by: ChannelDataCreatedBy;
  frozen: boolean;
  disabled: boolean;
  member_count: number;
  config: ChannelDataConfig;
  own_capabilities: string[];
  hidden: boolean;
  name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_emoji_name?: string;
  anon_user_info_color_name?: string;
  anon_user_info_color_code?: string;
}

export interface ChannelDataCreatedBy {
  id: string;
  role: string;
  created_at: string;
  updated_at: string;
  last_active: string;
  banned: boolean;
  online: boolean;
  name: string;
  image: string;
}

export interface ChannelDataConfig {
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

export interface Command {
  name: string;
  description: string;
  args: string;
  set: string;
}
