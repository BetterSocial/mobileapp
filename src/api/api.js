import axios from 'axios';
import {BASE_URL, BASE_URL_DEV} from '@env';
import configEnv from 'react-native-config'
import {getAccessToken} from '../utils/token';

const api = axios.create({
  baseURL: configEnv.BASE_URL,
  timeout: 3000,
  headers: {'content-type': 'application/json'},
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = 'Bearer ' + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
