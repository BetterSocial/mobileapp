import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const getTopicPages = async (query, offset = 0) => {
  try {
    const res = await api.get(`/topic-pages/${query}?offset=${offset}`);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw error;
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getTopicPages
};
