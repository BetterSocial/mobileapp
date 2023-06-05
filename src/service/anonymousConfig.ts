import axios from 'axios';
import configEnv from 'react-native-config';

import {getAnonymousToken, getRefreshToken, setAccessToken, setRefreshToken} from '../utils/token';

const baseURL = configEnv.BASE_URL;

const anonymousApi = axios.create({
  baseURL,
  timeout: 3000,
  headers: {'content-type': 'application/json'}
});
anonymousApi.interceptors.request.use(
  async (config) => {
    const token = await getAnonymousToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

anonymousApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error?.response?.status === 401 &&
      error?.response?.config?.url !== '/users/refresh-token'
    ) {
      const token = await getRefreshToken();
      const refreshApi = axios.create({
        baseURL,
        timeout: 3000,
        headers: {'content-type': 'application/json', authorization: `Bearer ${token}`}
      });
      return refreshApi.get('/users/refresh-token').then(
        async (refreshResponse) => {
          const data = refreshResponse?.data?.data;
          if (data?.token) {
            await setRefreshToken(data?.refresh_token);
            await setAccessToken(data?.token);
            return axios.request(error?.config);
          }
          return Promise.reject(error);
        },
        (refreshError) => {
          if (__DEV__) {
            console.log('refreshError: ', refreshError);
          }
          return Promise.reject(error);
        }
      );
    }
    return Promise.reject(error);
  }
);

export default anonymousApi;
