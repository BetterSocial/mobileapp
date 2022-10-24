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

export const getLinkPreviewInfo = async (domain, url) => {
  try {
    const response = await api.post('/feeds/open-graph', {
      domain,
      url
    })

    if (response?.status !== 200) return {
      success: false,
      message: response?.data?.message
    }

    return {
      success: true,
      data: response?.data?.data
    }
  } catch (e) {
    return {
      success: false,
      message: e
    }
  }
}