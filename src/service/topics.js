import api from "./config";
import crashlytics from '@react-native-firebase/crashlytics';

const getUserTopic = async (query) => {
  try {
    const res = await api.get(`/topics/follow${query}`);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
}

const putUserTopic = async (data) => {
  try {
    const res = await api.put('/topics/follow', data);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }

}

export {
  getUserTopic,
  putUserTopic,
}