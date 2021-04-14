import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { BASE_URL } from '@env'
const api = axios.create({
  baseURL: BASE_URL,
  timeout: 3000,
  headers: {'content-type': 'application/json'},
});

api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
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
