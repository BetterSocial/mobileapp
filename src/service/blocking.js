import crashlytics from '@react-native-firebase/crashlytics';

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
export const unblockUserApi = async (data) => new Promise((resolve, reject) => {
  api
    .post('/users/unblock', data)
    .then((response) => {
      resolve(response.data);
    })
    .catch((e) => {
      reject(e.response.data);
    });
});
