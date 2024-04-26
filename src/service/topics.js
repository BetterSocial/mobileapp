import crashlytics from '@react-native-firebase/crashlytics';

import OneSignalUtil from './onesignal';
import api from './config';
import {Monitoring} from '../libraries/monitoring/sentry';
import anonymousApi from './anonymousConfig';

const getUserTopic = async (query) => {
  try {
    const res = await api.get(`/topics/follow${query}`);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const putUserTopic = async (data, isIncognito) => {
  let res;
  try {
    if (isIncognito) {
      res = await anonymousApi.put('/topics/follow-v2', {
        ...data,
        with_system_message: true
      });
    } else {
      res = await api.put('/topics/follow-v2', {
        ...data,
        with_system_message: true
      });
    }
    OneSignalUtil.rebuildAndSubscribeTags();
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const getFollowingTopic = async () => {
  try {
    const processGetFollowTopic = await api.get('/topics/followed');
    return processGetFollowTopic.data;
  } catch (e) {
    throw new Error(e);
  }
};

const getAllMemberTopic = async (query) => {
  try {
    const res = await api.get(`/topics/follower-list${query}&limit=40`);
    return res.data;
  } catch (e) {
    throw new Error(e);
  }
};

/**
 *
 * @param {string} name
 * @param {import('axios').AxiosRequestConfig} axiosOptions
 * @returns
 */
const getTopics = async (name, axiosOptions = {}) => {
  try {
    const result = await api.get(`/topics/?name=${name}`, axiosOptions);
    return result.data;
  } catch (e) {
    throw new Error(e);
  }
};

const getSubscribeableTopic = async () => {
  try {
    const result = await api.get('topics/subscribable');
    return result.data;
  } catch (e) {
    Monitoring.logError('Error getSubscribeableTopic API', e);
    throw new Error(e);
  }
};

const getWhoToFollowList = async (topics, locations, page = 1, axiosOptions = {}) => {
  try {
    const topicsQueryString = topics
      .map((topic) => `topics[]=${encodeURIComponent(topic)}`)
      .join('&');
    const locationsQueryString = locations
      .map((topic) => `locations[]=${encodeURIComponent(topic)}`)
      .join('&');
    const result = await api.get(
      `/who-to-follow/list_v2?${locationsQueryString}&${topicsQueryString}&page=${page}`,
      axiosOptions
    );
    return result.data.body;
  } catch (e) {
    throw new Error(e);
  }
};

export {
  getUserTopic,
  putUserTopic,
  getFollowingTopic,
  getAllMemberTopic,
  getTopics,
  getSubscribeableTopic,
  getWhoToFollowList
};
