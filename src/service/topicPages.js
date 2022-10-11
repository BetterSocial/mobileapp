import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const getTopicPages = async (query, offset = 0, limit = 10) => {
  try {
    const res = await api.get(`/topic-pages/${query}?offset=${offset}&limit=${limit}`);
    return res.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    // throw new Error(error);
    return []
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getTopicPages,
};
