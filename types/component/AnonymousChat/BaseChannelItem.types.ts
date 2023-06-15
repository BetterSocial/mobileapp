/* eslint-disable no-shadow */
export enum BaseChannelItemTypeProps {
  ANON_PM = 'ANON_PM',
  ANON_POST_NOTIFICATION = 'ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION = 'MY_ANON_POST_NOTIFICATION',
  ANON_POST_NOTIFICATION_I_COMMENTED = 'ANON_POST_NOTIFICATION_I_COMMENTED'
}

export interface BaseChannelItemProps {
  anonPostNotificationUserInfo: any;
  picture: string;
  name: string;
  message: string;
  time: string;
  type: BaseChannelItemTypeProps;
  postNotificationMessageText?: string;
  postNotificationMessageUser?: string;
  unreadCount?: number;
  postNotificationPicture?: string;
  upvote?: number;
  downvote?: number;
  comments?: number;
  block?: number;
  isCommentExists?: boolean;
  onPress?: () => void;
}
