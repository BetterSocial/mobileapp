/* eslint-disable import/prefer-default-export */
import crashlytics from '@react-native-firebase/crashlytics';
import api from './config';

export const getFeedNotification = async () => {
  try {
    const url = '/feeds/feed-chat';
    const feedNotif = await api.get(url);
    return feedNotif.data;
  } catch (e) {
    crashlytics().recordError(e);
    throw new Error(String(e));
  }
};
