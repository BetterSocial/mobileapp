import axios from 'axios';
import {getToken} from '../data/local/accessToken';
import {BASE_URL, BASE_URL_DEV} from '@env';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {'content-type': 'application/json'},
});
api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
