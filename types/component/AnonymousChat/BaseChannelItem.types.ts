/* eslint-disable no-shadow */
export enum BaseChannelItemTypeProps {
  ANON_PM = 'ANON_PM',
  ANON_POST_NOTIFICATION = 'ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION = 'MY_ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION_I_COMMENTED = 'MY_ANON_POST_NOTIFICATION_I_COMMENTED',
  ANON_POST_NOTIFICATION_I_COMMENTED = 'ANON_POST_NOTIFICATION_I_COMMENTED'
}

export interface BaseChannelItemProps {
  isMe: boolean;
  message: string;
  name: string;
  picture: string;
  time: string;
  type: BaseChannelItemTypeProps;
  anonPostNotificationUserInfo?: any;
  block?: number;
  comments?: number;
  downvote?: number;
  isCommentExists?: boolean;
  onPress?: () => void;
  postNotificationMessageText?: string;
  postNotificationMessageUser?: string;
  postNotificationPicture?: string;
  unreadCount?: number;
  upvote?: number;
  postMaker?: any;
}
