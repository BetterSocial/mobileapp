import crashlytics from '@react-native-firebase/crashlytics';

import StorageUtils from '../utils/storage';
import api from './config';

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

export const demoVerifyUser = async (user_id, password) => {
  try {
    const resApi = await api.post('/users/demo-verify-user-v2', {
      user_id,
      password
    });

    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    if (error?.response?.data?.status?.toLowerCase() === 'password is invalid') {
      throw new Error('Password is invalid');
    }

    return error?.response?.data;
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
    const resApi = await api.post('/users/register-v2-without-upload-photo', {
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
  const token = StorageUtils.refreshToken.get();
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

export const userPopulate = async (isAnon) => {
  try {
    const resApi = await api.get(`/users/populate${isAnon ? '?allow_anon_dm=true' : ''}`);
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

export const removeFcmToken = async (fcmToken) => {
  try {
    const result = await api.delete(`/users/fcmtoken-v2?fcm_token=${fcmToken}`);
    return result.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return null;
  }
};

export const verifyHumanIdExchangeToken = async (exchangeToken, dummy = false) => {
  const data = {
    token: exchangeToken
  };

  const exchangeTokenUrl = dummy
    ? '/users/check-exchange-token-dummy'
    : '/users/check-exchange-token';

  try {
    const result = await api.post(exchangeTokenUrl, data);

    return Promise.resolve(result?.data);
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return Promise.reject(error?.response?.data);
  }
};

export const checkPasswordForDemoLogin = async (password) => {
  try {
    const payload = {password};
    const result = await api.post('/users/password-verify-user', payload);
    if (result?.data?.code === 200) {
      return {
        success: true,
        message: result?.data?.message
      };
    }

    return {
      code: result?.data?.code,
      success: false,
      message: result?.data?.message
    };
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return {
      success: false,
      code: e?.response?.data?.code,
      message: e?.response?.data?.message
    };
  }
};

export const checkFollowStatusBatch = async (targetUserIds = [], axiosOptions = {}) => {
  if (targetUserIds.length === 0) return Promise.reject(new Error('User IDs is empty'));

  try {
    const payload = {
      targetUserIds
    };

    const result = await api.post('/users/check-follow-batch', payload, axiosOptions);
    if (result?.status === 200) {
      return Promise.resolve(result?.data?.data);
    }

    return Promise.reject(result?.data?.message);
  } catch (e) {
    crashlytics().recordError(new Error(e));
    return Promise.reject(
      e?.response?.data?.message || "Can't check follow status, please try again later"
    );
  }
};
