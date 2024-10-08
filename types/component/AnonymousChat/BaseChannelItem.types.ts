import {AnonUserInfo} from '../../service/AnonProfile.type';

export type Anonimity = 'ANONYMOUS' | 'SIGNED';

/* eslint-disable no-shadow */
export enum BaseChannelItemTypeProps {
  SIGNED_PM = 'SIGNED_PM',
  ANON_PM = 'ANON_PM',

  MY_SIGNED_POST_NOTIFICATION = 'MY_SIGNED_POST_NOTIFICATION',
  MY_SIGNED_POST_NOTIFICATION_I_COMMENTED = 'MY_SIGNED_POST_NOTIFICATION_I_COMMENTED',
  MY_SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY = 'MY_SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY',
  MY_SIGNED_POST_NOTIFICATION_COMMENTED = 'MY_SIGNED_POST_NOTIFICATION_COMMENTED',
  MY_SIGNED_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY = 'MY_SIGNED_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY',

  MY_ANON_POST_NOTIFICATION = 'MY_ANON_POST_NOTIFICATION',
  MY_ANON_POST_NOTIFICATION_I_COMMENTED = 'MY_ANON_POST_NOTIFICATION_I_COMMENTED',
  MY_ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY = 'MY_ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY',
  MY_ANON_POST_NOTIFICATION_COMMENTED = 'MY_ANON_POST_NOTIFICATION_COMMENTED',
  MY_ANON_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY = 'MY_ANON_POST_NOTIFICATION_COMMENTED_ANONYMOUSLY',

  SIGNED_POST_NOTIFICATION = 'SIGNED_POST_NOTIFICATION',
  SIGNED_POST_NOTIFICATION_I_COMMENTED = 'SIGNED_POST_NOTIFICATION_I_COMMENTED',
  SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY = 'SIGNED_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY',

  ANON_POST_NOTIFICATION = 'ANON_POST_NOTIFICATION',
  ANON_POST_NOTIFICATION_I_COMMENTED = 'ANON_POST_NOTIFICATION_I_COMMENTED',
  ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY = 'ANON_POST_NOTIFICATION_I_COMMENTED_ANONYMOUSLY'
}

export interface BaseChannelItemProps {
  anonPostNotificationUserInfo?: any;
  dbAnonUserInfo: AnonUserInfo;
  block?: number;
  comments?: number;
  downvote?: number;
  isCommentExists?: boolean;
  isMe: boolean;
  isOwnSignedPost?: boolean;
  message: any;
  name: string;
  onPress?: () => void;
  picture: string;
  postMaker?: any;
  postNotificationMessageText?: string;
  postNotificationMessageUser?: string;
  postNotificationPicture?: string;
  time: string;
  type: BaseChannelItemTypeProps;
  unreadCount?: number;
  upvote?: number;
  hasFollowButton?: boolean;
  showFollowingButton?: boolean;
  handleFollow?: () => void;
  channelType?: string;
  hasAttachment?: boolean;
  postNotificationIsMediaOnly?: boolean;
  containerBackgroundColor?: string;
}
