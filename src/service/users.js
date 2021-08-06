import api from './config';
import crashlytics from '@react-native-firebase/crashlytics';
import {getRefreshToken, setAccessToken, setRefreshToken} from '../utils/token';
import {BASE_URL} from '@env';
export const verifyUser = async (userId) => {
  try {
    // console.log(BASE_URL);
    let resApi = await api.post('/users/verify-user', {
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
    let resApi = await api.post('/users/veryfy-token', {
      token,
    });
    console.log(resApi.data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.log(error);
  }
};
export const verifyUsername = async (username) => {
  try {
    let resApi = await api.post('/users/check-username', {
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
    let resApi = await api.post('/users/register', {
      data,
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

const verifyAccessToken = async () => {
  return api
    .get('/users/veryfy-token-getstream', {})
    .then((res) => {
      return res.data;
    })
    .catch((err) => {
      let code = err.response.status;
      return code;
    });
};

export const verifyTokenGetstream = async () => {
  let status = await verifyAccessToken();
  if (status === 401) {
    let res = await refreshToken();
    if (res.code === 200) {
      await setAccessToken(res.data.token);
      await setRefreshToken(res.data.refresh_token);
      return res.data.token;
    } else {
      return null;
    }
  } else {
    return status;
  }
};

export const refreshToken = async () => {
  const token = await getRefreshToken();
  const options = {
    method: 'get',
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };

  // const resp = await fetchWithTimeout(this.url, options, 10000);
  const resp = await fetch(BASE_URL + '/users/refresh-token', options);
  return await resp.json();
};
