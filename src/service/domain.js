import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

export const getDomains = async (offset = 0, limit = 10) => {
  try {
    const url = `/domain?offset=${offset}&limit=${limit}`;
    const res = await api.get(url);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getDetailDomains = async (domain) => {
  try {
    const res = await api.get(`/domain/domain/${domain}`);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getLinkContextScreenRelated = async (newsLinkId) => {
  try {
    const res = await api.get(`/domain/link-context-screen/${newsLinkId}`);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getProfileDomain = async (name) => {
  try {
    const res = await api.get(`/domain/profile-domain/${name}`);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
export const followDomain = async (data) => {
  try {
    const res = await api.post('/domain/follow', data);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
export const unfollowDomain = async (data) => {
  try {
    const res = await api.post('/domain/unfollow', data);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};
export const getDomainIdIFollow = async () => {
  try {
    const res = await api.get('/domain/ifollow');
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getFollowedDomain = async (body) => {
  try {
    const processGetFollowDomain = await api.get('/domain/followed');
    return processGetFollowDomain;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    throw new Error(e);
  }
};

export const getBlockedDomain = async () => {
  try {
    const processGetFollowDomain = await api.get('/domain/blocked');
    return processGetFollowDomain.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    throw new Error(e);
  }
};

export const checkBlockDomainPage = async (domainId) => {
  try {
    const processGetFollowDomain = await api.get(`/domain/check-blocked/${domainId}`);
    return processGetFollowDomain.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    throw new Error(e);
  }
};

export const getDomainDetailById = async (domainId) => {
  try {
    const processGetDomain = await api.get(`/domain/detail/${domainId}`);
    return processGetDomain.data.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    throw new Error(e);
  }
};
