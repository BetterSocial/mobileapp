import axios from 'axios';
import configEnv from 'react-native-config';
import { BASE_URL, BASE_URL_DEV } from '@env';

import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../utils/token';

const baseURL = configEnv.BASE_URL

const api = axios.create({
  baseURL,
  timeout: 3000,
  headers: { 'content-type': 'application/json' },
});
api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error?.response?.status === 401 && error?.response?.config?.url !== '/users/refresh-token') {
      const token = await getRefreshToken();
      const refreshApi = axios.create({
        baseURL,
        timeout: 3000,
        headers: { 'content-type': 'application/json', 'authorization': `Bearer ${token}` },
      });
      return refreshApi.get('/users/refresh-token').then((refreshResponse) => {
        const data = refreshResponse?.data?.data
        if (data?.token) {
          setRefreshToken(data?.refresh_token)
          setAccessToken(data?.token)
          return axios.request(error?.config)
        }
        return Promise.reject(error)
      }, (refreshError) => {
        console.log('refreshError')
        return Promise.reject(error)
      })
    }
    return Promise.reject(error)
  }
)

export default api;
