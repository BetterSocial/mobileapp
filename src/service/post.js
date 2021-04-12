import api from './config';
import crashlytics from '@react-native-firebase/crashlytics';
export const createPost = async (data) => {
  try {
    let resApi = await api.post('/activity/post', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    console.log(error);
  }
};
