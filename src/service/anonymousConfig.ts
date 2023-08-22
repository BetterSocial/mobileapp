import axios from 'axios';
import configEnv from 'react-native-config';

import TokenStorage, {ITokenEnum} from '../utils/storage/custom/tokenStorage';

const baseURL = configEnv.BASE_URL;

const anonymousApi = axios.create({
  baseURL,
  timeout: 3000,
  headers: {'content-type': 'application/json'}
});
anonymousApi.interceptors.request.use(
  async (config) => {
    const token = TokenStorage.get(ITokenEnum.anonymousToken);
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
    const isStatus401 = error?.response?.status === 401;
    const isRefreshTokenUrl = error?.response?.config?.url === '/users/refresh-token';
    if (isStatus401 && !isRefreshTokenUrl) {
      const token = TokenStorage.get(ITokenEnum.refreshToken);
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
            error.config.headers.Authorization = `Bearer ${data?.anonymousToken}`;
            return axios.request(error?.config);
          }
          return Promise.reject(error);
        },
        (refreshError) => {
          if (__DEV__) {
            console.log('refreshError: ', refreshError?.response?.data);
          }
          return Promise.reject(error);
        }
      );
    }
    return Promise.reject(error);
  }
);

export default anonymousApi;
