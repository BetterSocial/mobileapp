export interface UserData {
  username: string;
}

export interface User {
  created_at: string;
  data: UserData;
  id: string;
  updated_at: string;
}

export interface AdditionalData {
  anon_user_info_color_code: string;
  anon_user_info_color_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_emoji_name: string;
  count_downvote: number;
  count_upvote: number;
  isNotSeen: boolean;
  is_anonymous: boolean;
  text: string;
}

export interface Reaction {
  activity_id: string;
  children_counts: any;
  created_at: string;
  data: AdditionalData;
  id: string;
  kind: string;
  latest_children: any;
  parent: string;
  target_feeds: string[];
  updated_at: string;
  user: User;
  user_id: string;
}

export interface FeedObject {
  actor: User;
  anon_user_info_color_code: string;
  anon_user_info_color_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_emoji_name: string;
  anonimity: boolean;
  count_downvote: number;
  count_upvote: number;
  duration_feed: string;
  expired_at: any;
  foreign_id: string;
  id: string;
  images_url: any[];
  location: string;
  message: string;
  object: string;
  origin: any;
  post_type: number;
  privacy: string;
  target: string;
  time: string;
  topics: string[];
  verb: string;
  version: number;
}

export interface NewFeed {
  actor: User;
  foreign_id: string;
  group: string;
  id: string;
  object: FeedObject;
  origin: any;
  reaction: Reaction;
  target: string;
  time: string;
  verb: string;
}

export interface GetstreamFeedListenerObject {
  deleted: any[];
  deleted_foreign_ids: any[];
  feed: string;
  new: NewFeed[];
}
