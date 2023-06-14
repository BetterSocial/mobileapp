import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';
import {getRefreshToken} from '../utils/token';

export const verifyUser = async (userId) => {
  try {
    const resApi = await api.post('/users/verify-user', {
      user_id: userId
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const demoVerifyUser = async (userId) => {
  try {
    const resApi = await api.post('/users/demo-verify-user', {
      user_id: userId
    });

    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

/**
 *
 * @param {String} query
 * @returns {import('../../types/service/UserService.typedef').UserSearchChatApiResponse | Boolean}
 */
export const searchChatUsers = async (query) => {
  try {
    const resApi = await api.get(`/users/chat/search?q=${query}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return false;
  }
};

export const verifyToken = async (token) => {
  try {
    const resApi = await api.post('/users/veryfy-token', {
      token
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
export const verifyUsername = async (username) => {
  try {
    const resApi = await api.post('/users/check-username', {
      username
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
export const registerUser = async (data) => {
  try {
    const resApi = await api.post('/users/register-v2', {
      data
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

const verifyAccessToken = async () =>
  api
    .get('/users/veryfy-token-getstream', {})
    .then((res) => res.data)
    .catch((err) => {
      const code = err.response.status;
      return code;
    });

export const refreshToken = async () => {
  const token = await getRefreshToken();
  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };

  // const resp = await fetchWithTimeout(this.url, options, 10000);
  try {
    const resp = await api.get('/users/refresh-token', options);
    return resp.data;
  } catch (err) {
    return err?.response?.data;
  }
};

export const verifyTokenGetstream = async () => {
  const status = await verifyAccessToken();
  if (status === 401) {
    const res = await refreshToken();

    if (res.code === 200) {
      return res.data.token;
    }
    return null;
  }
  return status.data;
};

export const userPopulate = async () => {
  try {
    const resApi = await api.get('/users/populate');
    return resApi.data.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const getBlockedUserList = async () => {
  try {
    const getBlockList = await api.get('/profiles/block');
    return getBlockList.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return e.response.data;
  }
};

export const deleteAccount = async () => {
  try {
    const result = await api.post('/users/delete');
    return result.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return null;
  }
};

export const fcmTokenService = async (body) => {
  try {
    const result = await api.post('/users/fcmtoken', body);
    return result.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return null;
  }
};

export const removeFcmToken = async () => {
  try {
    const result = await api.delete('/users/fcmtoken');
    return result.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return null;
  }
};

export const verifyHumanIdExchangeToken = async (exchangeToken) => {
  try {
    const result = await api.post('/users/check-exchange-token', {
      token: exchangeToken
    });

    return Promise.resolve(result?.data);
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return Promise.reject(error?.response?.data);
  }
};

export const generateUserInfoOtherProfile = async (userId) => {
  try {
    console.log({userId});
    const result = await api.post(`/chat/users/${userId}`);
    console.log({result});

    return Promise.resolve(result?.data);
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.error({error});
    return Promise.reject(error?.response?.data);
  }
};
