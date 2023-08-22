import axios from 'axios';
import configEnv from 'react-native-config';

import StorageUtils from '../utils/storage';
import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';

const baseURL = configEnv.BASE_URL;

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: {'content-type': 'application/json'}
});
api.interceptors.request.use(
  async (config) => {
    const token = TokenStorage.get(ITokenEnum.token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (
      error?.response?.status === 401 &&
      error?.response?.config?.url !== '/users/refresh-token'
    ) {
      const token = await StorageUtils.refreshToken.get();
      const refreshApi = axios.create({
        baseURL,
        timeout: 3000,
        headers: {'content-type': 'application/json', authorization: `Bearer ${token}`}
      });
      return refreshApi.get('/users/refresh-token').then(
        async (refreshResponse) => {
          const data = refreshResponse?.data?.data;
          if (data?.token) {
            TokenStorage.set(data);
            error.config.headers.Authorization = `Bearer ${data?.token}`;
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

export default api;
