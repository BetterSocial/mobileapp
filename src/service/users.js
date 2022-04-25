import SimpleToast from 'react-native-simple-toast';
import config from 'react-native-config';
import crashlytics from '@react-native-firebase/crashlytics';
import { BASE_URL } from '@env';

import api from './config';
import { getRefreshToken, setAccessToken, setRefreshToken } from '../utils/token';

export const verifyUser = async (userId) => {
  try {
    const resApi = await api.post('/users/verify-user', {
      user_id: userId,
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.log(error);
  }
};
export const verifyToken = async (token) => {
  try {
    const resApi = await api.post('/users/veryfy-token', {
      token,
    });
    // console.log(resApi.data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.log(error);
  }
};
export const verifyUsername = async (username) => {
  try {
    const resApi = await api.post('/users/check-username', {
      username,
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.log(error);
  }
};
export const registerUser = async (data) => {
  try {
    const resApi = await api.post('/users/register', {
      data,
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

const verifyAccessToken = async () => api
  .get('/users/veryfy-token-getstream', {})
  .then((res) => res.data)
  .catch((err) => {
    const code = err.response.status;
    return code;
  });

export const verifyTokenGetstream = async () => {
  const status = await verifyAccessToken();
  if (status === 401) {
    const res = await refreshToken();
    if (res.code === 200) {
      await setAccessToken(res.data.token);
      await setRefreshToken(res.data.refresh_token);
      return res.data.token;
    }
    return null;
  }
  return status;
};

export const refreshToken = async () => {
  const token = await getRefreshToken();
  const options = {
    method: 'get',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // const resp = await fetchWithTimeout(this.url, options, 10000);
  const resp = await fetch(`${config.BASE_URL}/users/refresh-token`, options);
  return await resp.json();
};

export const userPopulate = async () => {
  try {
    const resApi = await api.get('/users/populate');
    return resApi.data.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.log(error);
  }
};

export const getBlockedUserList = async () => {
  try {
    const getBlockList = await api.get('/profiles/block');
    return getBlockList.data;
  } catch (e) {
    crashlytics().recordError(new Error(e));
  }
};
