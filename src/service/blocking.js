import crashlytics from '@react-native-firebase/crashlytics';
import axios from 'axios';

import api from './config';

export const blockUser = async (data) => {
  console.log('sapiman',data)
  try {
    const resApi = await api.post('/users/blockuser', data);
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
    const resApi = await api.post('/users/block-post-anonymous', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const unblokDomain = async (data) => {
  try {
    let resApi = await api.post('/domain/unblock', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
}
export const unblockUserApi = async (data) => {
    try {
    const response = await api.post('/users/unblock', data)
    return response.data
  } catch(e) {
    if(axios.isAxiosError(e)) {
      return e.response
    }
  }
}
