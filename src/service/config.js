import axios from 'axios';
import configEnv from 'react-native-config';

import { getAccessToken } from '../utils/token';
import { getErrorConfig, logError } from '../libraries/crashlytics';

const api = axios.create({
  baseURL: configEnv.BASE_URL,
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
  (error) => {
    logError({
      type: 'API_NETWORK_EXCEPTION',
      data: {
        code: error.code,
        message: error.message,
        ...getErrorConfig(error.config)
      }
    });
    return Promise.reject(error);
  },
);

export default api;
