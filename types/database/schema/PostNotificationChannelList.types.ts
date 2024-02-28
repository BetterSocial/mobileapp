import {ChannelList} from './ChannelList.types';

export interface UserData {
  username: string;
  profile_pic_url: string;
}

export interface Data {
  last_message_at: string;
  updated_at: string;
}

export interface User {
  created_at: string;
  updated_at: string;
  id: string;
  data: UserData;
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

export interface LatestChildren {
  comment: Reaction[];
}

export interface Reaction {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  user: any;
  kind: string;
  activity_id: string;
  data: AdditionalData;
  target_feeds: string[];
  parent: string;
  latest_children: LatestChildren;
  children_counts: any;
  isOwningReaction: boolean;
}

export interface Comment {
  reaction: Reaction;
  actor: any;
  user: User;
}

export interface PostNotificationChannelListData {
  activity_id: string;
  data: Data;
  isSeen: boolean;
  totalComment: number;
  isOwnPost: boolean;
  isOwnAnonymousPost: boolean;
  isOwnSignedPost: boolean;
  totalCommentBadge: number;
  isRead: boolean;
  type: string;
  titlePost: string;
  downvote: number;
  upvote: number;
  postMaker: User;
  isAnonym: boolean;
  comments: Comment[];
  unreadComment: number;
  block: number;
}

export interface PostNotificationChannelList extends ChannelList {
  rawJson: PostNotificationChannelListData;
}
