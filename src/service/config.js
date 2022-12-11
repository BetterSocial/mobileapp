/* eslint-disable no-param-reassign */
import axios from 'axios';
import configEnv from 'react-native-config';

import { getAccessToken, getRefreshToken, setAccessToken, setRefreshToken } from '../utils/token';
import { trackingHttpMetric } from '../libraries/performance/firebasePerformance';

const baseURL = configEnv.BASE_URL

const api = axios.create({
  baseURL,
  timeout: 3000,
  headers: { 'content-type': 'application/json' },
});

api.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token.id}`;
    }

    console.log(config.method.toUpperCase())
    const httpMetric = await trackingHttpMetric(config.url, config.method.toUpperCase());
    await httpMetric.start();

    config.metadata = { httpMetric };
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  async (response) => {
    const { httpMetric } = response.config.metadata;

    httpMetric.setHttpResponseCode(response.status);
    httpMetric.setResponseContentType(response.headers['content-type']);
    await httpMetric.stop();

    return response;
  },
  async (error) => {
    const { httpMetric } = error.config.metadata;
    httpMetric.setHttpResponseCode(error.response.status);
    httpMetric.setResponseContentType(error.response.headers['content-type']);

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
        if (__DEV__) {
          console.log('refreshError:', refreshError);
        }
        return Promise.reject(error)
      })
    }
    return Promise.reject(error)
  }

  const httpMetric = await trackingHttpMetric(config.url, config.method.toUpperCase());
  await httpMetric.start();

  config.metadata = { httpMetric };
  return config;
}

const requestTokenInterceptorRejected = (error) => Promise.reject(error)

const responseAccessTokenInterceptorSuccess = async (response) => {
  const { httpMetric } = response.config.metadata;

  httpMetric.setHttpResponseCode(response.status);
  httpMetric.setResponseContentType(response.headers['content-type']);
  await httpMetric.stop();

  return response;
}

const responseAccessTokenInterceptorRejected = async (error) => {
  const { httpMetric } = error.config.metadata;
  httpMetric.setHttpResponseCode(error.response.status);
  httpMetric.setResponseContentType(error.response.headers['content-type']);

  await httpMetric.stop();
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
      if (__DEV__) {
        console.log('refreshError:', refreshError);
      }
      return Promise.reject(refreshError)
    })
  }
  return Promise.reject(error)
}

api.interceptors.request.use(requestTokenInterceptorSuccess, requestTokenInterceptorRejected);
api.interceptors.response.use(responseAccessTokenInterceptorSuccess, responseAccessTokenInterceptorRejected)

export default api;
