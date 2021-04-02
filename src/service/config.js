import axios from 'axios';
import {getToken} from '../data/local/accessToken';
import {BASE_URL, BASE_URL_DEV} from '@env';

const api = axios.create({
  baseURL: BASE_URL_DEV,
  timeout: 3000,
  headers: {'content-type': 'application/json'},
});

api.interceptors.request.use(
  async (config) => {
    // const token = await getToken();
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjg4ZDU2NzktNmM2OC00MWVjLWJlODMtN2YxNWE0ZTgyZDNkIn0.0YNINzuHdf2afDN0ew3x0DRT0uJFzvBD0CbYL_Exm9c';
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
