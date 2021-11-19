import crashlytics from '@react-native-firebase/crashlytics';
import api from './config';

const getTopicPages = async (query) => {
  try {
    const res = await api.get(`/topic-pages/${query}`);
    return res.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getTopicPages,
};
