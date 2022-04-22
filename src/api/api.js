import axios from 'axios';
import configEnv from 'react-native-config';
import { BASE_URL, BASE_URL_DEV } from '@env';

import { getAccessToken } from '../utils/token';

const api = axios.create({
  baseURL: configEnv.BASE_URL,
  // baseURL: 'http://192.168.0.18:3000/api/v1',
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

export default api;
