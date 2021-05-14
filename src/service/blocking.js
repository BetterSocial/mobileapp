import crashlytics from '@react-native-firebase/crashlytics';
import api from './config';

export const blockUser = async (data) => {
  try {
    let resApi = await api.post('/users/blockuser', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const blockDomain = async (data) => {
  try {
    let resApi = await api.post('/users/block-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
