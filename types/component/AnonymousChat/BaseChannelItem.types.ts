/* eslint-disable no-shadow */
export enum BaseChannelItemTypeProps {
  ANON_PM = 'ANON_PM',
  ANON_POST_NOTIFICATION = 'ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION = 'MY_ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION_I_COMMENTED = 'MY_ANON_POST_NOTIFICATION_I_COMMENTED',
  ANON_POST_NOTIFICATION_I_COMMENTED = 'ANON_POST_NOTIFICATION_I_COMMENTED'
}

export interface BaseChannelItemProps {
  anonPostNotificationUserInfo?: any;
  block?: number;
  comments?: number;
  downvote?: number;
  isCommentExists?: boolean;
  isMe: boolean;
  isOwnSignedPost?: boolean;
  message: string;
  name: string;
  onPress?: () => void;
  picture: string;
  postMaker?: any;
  postNotificationMessageText?: string;
  postNotificationMessageUser?: string;
  postNotificationPicture?: string;
  showPostNotificationStats?: boolean;
  time: string;
  type: BaseChannelItemTypeProps;
  unreadCount?: number;
  upvote?: number;
}
