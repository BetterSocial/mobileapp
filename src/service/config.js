import axios from 'axios';
import configEnv from 'react-native-config';

import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../utils/token';

const baseURL = configEnv.BASE_URL

const api = axios.create({
  baseURL,
  timeout: 3000,
  headers: { 'content-type': 'application/json' },
});

const requestTokenInterceptorSuccess = async (config) => {
  const token = await getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token.id}`;
  }
  return config;
}

const requestTokenInterceptorRejected = (error) => Promise.reject(error)

const responseAccessTokenInterceptorSuccess = (response) => response
const responseAccessTokenInterceptorRejected = async (error) => {
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
      return Promise.reject(refreshError)
    })
  }
  return Promise.reject(error)
}

api.interceptors.request.use(requestTokenInterceptorSuccess, requestTokenInterceptorRejected);
api.interceptors.response.use(responseAccessTokenInterceptorSuccess, responseAccessTokenInterceptorRejected)

export default api;
