export interface MyProfileContext {
  allow_anon_dm: boolean;
  bio: string | null;
  country_code: string;
  created_at: string;
  encrypted: string | null;
  follower: number;
  follower_symbol: string;
  following: number;
  following_symbol: string;
  is_anonymous: boolean;
  is_banned: boolean;
  last_active_at: string;
  only_received_dm_from_user_following: boolean;
  profile_pic_asset_id: string | null;
  profile_pic_path: string;
  profile_pic_public_id: string | null;
  real_name: string | null;
  status: string;
  updated_at: string;
  user_id: string;
  username: string;
}

export interface ProfileContext {
  isShowHeader: boolean;
  myProfile: MyProfileContext;
  navbarTitle: string;
}
