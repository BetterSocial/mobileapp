export interface GetAllAnonymousPostNotificationResponse {
  success: boolean;
  data: AnonymousPostNotification[];
  message: string;
}

export interface AnonymousPostNotification {
  activity_id: string;
  data: AnonymousPostNotificationData;
  isSeen: boolean;
  totalComment: number;
  isOwnPost: boolean;
  totalCommentBadge: number;
  isRead: boolean;
  type: string;
  titlePost: string;
  downvote: number;
  upvote: number;
  postMaker: PostMaker;
  isAnonym: boolean;
  comments: Comment[];
  unreadComment: number;
  block: number;
}

export interface AnonymousPostNotificationData {
  last_message_at: string;
  updated_at: string;
}

export interface PostMaker {
  created_at: string;
  updated_at: string;
  id?: string;
  data: PostMakerData;
}

export interface PostMakerData {
  profile_pic_url?: string;
  username: string;
}

export interface Comment {
  reaction: Reaction;
  actor: any;
}

export interface LatestChildrenComment {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  user: any;
  kind: string;
  activity_id: string;
  data: Data3;
  target_feeds: string[];
  parent: string;
  latest_children: LatestChildren;
  children_counts: any;
}

export interface LatestChildren {
  comment: LatestChildrenComment[];
}

export interface Reaction {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  user: any;
  kind: string;
  activity_id: string;
  data: Data3;
  target_feeds: string[];
  parent: string;
  latest_children: LatestChildren;
  children_counts: any;
  isOwningReaction: boolean;
}
export interface Data3 {
  anon_user_info_color_code: string;
  anon_user_info_color_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_emoji_name: string;
  count_downvote: number;
  count_upvote: number;
  isNotSeen: boolean;
  text: string;
}
