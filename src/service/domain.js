import api from './config';
import crashlytics from '@react-native-firebase/crashlytics';

export const getDomains = async (lastId = null) => {
  try {
    let url = '';
    if (lastId) {
      url = `/domain?id_lt=${lastId}`;
    } else {
      url = '/domain';
    }
    let res = await api.get(url);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getDetailDomains = async (domain) => {
  try {
    let res = await api.get(`/domain/domain/${domain}`);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export const getProfileDomain = async (name) => {
  try {
    let res = await api.get(`/domain/profile-domain/${name}`);
    return res.data;
  } catch (error) {
    console.log(error);
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
