export interface GetAllSignedPostNotificationResponse {
  success: boolean;
  data: SignedPostNotification[];
  message: string;
}

export interface SignedPostNotification {
  activity_id: string;
  block: number;
  comments: Comment[];
  data: SignedPostNotificationData;
  downvote: number;
  expired_at: string;
  isAnonym: boolean;
  isOwnPost: boolean;
  isRead: boolean;
  isSeen: boolean;
  postMaker: PostMaker;
  showToast: boolean;
  titlePost: string;
  totalComment: number;
  totalCommentBadge: number;
  type: string;
  unreadComment: number;
  upvote: number;
}
export interface Comment {
  reaction: Reaction;
  actor: any;
}

export interface Reaction {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  user: any;
  kind: string;
  activity_id: string;
  data: ReactionData;
  target_feeds: string[];
  parent: string;
  latest_children: LatestChildren;
  children_counts: any;
  isOwningReaction: boolean;
}

export interface ReactionData {
  anon_user_info_color_code: string;
  anon_user_info_color_name: string;
  anon_user_info_emoji_code: string;
  anon_user_info_emoji_name: string;
  count_downvote: number;
  count_upvote: number;
  isNotSeen: boolean;
  text: string;
}

export interface LatestChildren {
  comment: LatestChildrenComment[];
}

export interface LatestChildrenComment {
  created_at: string;
  updated_at: string;
  id: string;
  user_id: string;
  user: any;
  kind: string;
  activity_id: string;
  data: ReactionData;
  target_feeds: string[];
  parent: string;
  latest_children: LatestChildren;
  children_counts: any;
}

export interface SignedPostNotificationData {
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

// eslint-disable-next-line no-shadow
export enum ChannelTypeEnum {
  Messaging = 1,
  Group = 2
}
