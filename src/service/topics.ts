import crashlytics from '@react-native-firebase/crashlytics';

import OneSignalUtil from './onesignal';
import anonymousApi from './anonymousConfig';
import api from './config';
import {Monitoring} from '../libraries/monitoring/sentry';

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

export type TopicLatestPostData = {
  success?: boolean;
  status?: string;
  message: string;
  anon_user_info_color_code?: string;
  anon_user_info_color_name?: string;
  anon_user_info_emoji_code?: string;
  anon_user_info_emoji_name?: string;
  anonimity?: boolean;
  created_at?: string;
  duration_feed?: string;
  expired_at?: string;
  id?: string;
  unread_count?: number;
  time?: string;
};

const getLatestTopicPost = async (topicName: string): Promise<TopicLatestPostData | undefined> => {
  try {
    const res = await api.get(`/topics/latest?name=${topicName}`);
    return {
      ...res?.data?.data,
      status: res?.data?.status,
      success: res?.data?.success
    };
  } catch (e) {
    console.error(e?.response?.message || `Error on getting latest topic post ${topicName}`);
  }
};

const verifyCommunityName = async (name) => {
  try {
    const resApi = await api.get(`/topics/is-exist?name=${name}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

const submitCommunityName = async (name) => {
  try {
    const resApi = await api.post('/topics/create', {name});
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

const inviteCommunityMember = async (topicId, memberIds) => {
  try {
    const resApi = await api.post('/topics/invite-members', {
      topic_id: topicId,
      member_ids: memberIds
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export {
  getAllMemberTopic,
  getFollowingTopic,
  getLatestTopicPost,
  getSubscribeableTopic,
  getTopics,
  getUserTopic,
  getWhoToFollowList,
  putUserTopic,
  verifyCommunityName,
  submitCommunityName,
  inviteCommunityMember
};
