export interface AnonUser {
  targetUserId: string;
  myAnonUserId: string;
  anon_user_info_emoji_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_color_name: string;
  anon_user_info_color_code: string;
}

export interface AnonUserResponse {
  code: number;
  status: string;
  data: AnonUser;
}

export interface AnonDMBody {
  members: string[];
  message: string;
  anon_user_info_emoji_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_color_name: string;
  anon_user_info_color_code: string;
}
export interface AnonUserInfo {
  anon_user_info_emoji_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_color_name: string;
  anon_user_info_color_code: string;
}
