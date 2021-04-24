import axios from 'axios';
import {getAccessToken, getToken} from '../data/local/accessToken';
import {BASE_URL} from '@env';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  headers: {'content-type': 'application/json'},
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
    return Promise.reject(error);
  },
);

export default api;
