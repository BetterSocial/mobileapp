import axios from 'axios';
import {getToken} from '../data/local/accessToken';
// import Config from 'react-native-config';
// const BASE_URL = 'https://bettersocial-dev-user-api.herokuapp.com';
const BASE_URL = 'http://192.168.43.152:8000';
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  headers: {'content-type': 'application/json'},
});

api.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;
