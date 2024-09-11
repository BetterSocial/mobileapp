export type OneSignalNotificationData = {
  campaign?: string;
  type: 'pdp' | 'topic' | 'profile';
  feed_id?: string;
  username?: string;
  community?: string;
};
