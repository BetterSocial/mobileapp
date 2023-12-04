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
  members: string[];
  message: string;
  message_type?: string;
  reply_data?: any;
  anon_user_info_color_code: string;
  anon_user_info_color_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_emoji_name: string;
}

export interface InitAnonymousChatDataMember {
  user_id: string;
  human_id?: string;
  country_code?: string;
  username: string;
  real_name?: string;
  last_active_at?: string;
  profile_pic_path: string;
  profile_pic_asset_id?: string;
  profile_pic_public_id?: string;
  status?: string;
  bio?: string;
  is_banned?: boolean;
  is_anonymous?: boolean;
  allow_anon_dm?: boolean;
  only_received_dm_from_user_following?: boolean;
  is_backdoor_user?: boolean;
  created_at?: string;
  updated_at?: string;
  anon_user_info_color_code?: string;
  anon_user_info_color_name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_emoji_name?: string;
}

export interface InitAnonymousChatData {
  message: Message;
  duration: string;
  members: InitAnonymousChatDataMember[];
}

export interface ModifyAnonymousChatData extends InitAnonymousChatData {
  targetName: string;
  targetImage: string;
  reply_data: any;
}

export interface InitAnonymousChatResponse {
  code: number;
  status: string;
  data: InitAnonymousChatData;
}
