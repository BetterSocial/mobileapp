/* eslint-disable import/prefer-default-export */
import crashlytics from '@react-native-firebase/crashlytics';

import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './config';
import {FEED_CHAT_KEY} from '../utils/constants';

export const getFeedNotification = async () => {
  try {
    const url = '/feeds/feed-chat-v2';
    const feedNotif = await api.get(url);
    return feedNotif.data;
  } catch (e) {
    crashlytics().recordError(e);
    throw new Error(String(e));
  }
};

export const getFeedChatsFromLocal = async () => {
  const data = await AsyncStorage.getItem(FEED_CHAT_KEY);
  return JSON.parse(data);
};

export const setFeedChatsFromLocal = async (value) => {
  await AsyncStorage.setItem(FEED_CHAT_KEY, JSON.stringify(value));
};
export const removeFeedChatsFromLocal = () => {
  AsyncStorage.removeItem(FEED_CHAT_KEY);
};

export const getLinkPreviewInfo = async (domain, url) => {
  try {
    const response = await api.post('/feeds/open-graph', {
      domain,
      url
    });

    if (response?.status !== 200)
      return {
        success: false,
        message: response?.data?.message
      };

    return {
      success: true,
      data: response?.data?.data
    };
  } catch (e) {
    return {
      success: false,
      message: e
    };
  }
};

// eslint-disable-next-line consistent-return
export const getCommentChild = async (data) => {
  try {
    const response = await api.post('/feeds/reactions/', {
      activity_id: data.activity_id,
      limit: 100,
      feed_id: data.feed_id
    });
    return response.data;
  } catch (e) {
    if (__DEV__) {
      console.log('get comment child: ', e);
    }
  }
};
