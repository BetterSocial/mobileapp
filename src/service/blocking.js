import axios from 'axios';
import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

export const blockUser = async (data) => {
  try {
    const resApi = await api.post('/users/blockuser-v2', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const blockDomain = async (data) => {
  try {
    const resApi = await api.post('/users/block-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const blockAnonymous = async (data) => {
  try {
    const resApi = await api.post('/feeds/block-anonymous-post-v2', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const unblokDomain = async (data) => {
  try {
    const resApi = await api.post('/domain/unblock', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
export const unblockUserApi = async (data) => {
  try {
    const response = await api.post('/users/unblockuser-v2', data);
    return response.data;
  } catch (e) {
    if (axios.isAxiosError(e)) {
      return e.response;
    }

    return e.response || '';
  }
};

export const blockUserFromAnonChat = async (data) => {
  try {
    const resApi = await api.post('/users/block-anon-user-from-chat', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
