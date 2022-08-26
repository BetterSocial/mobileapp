import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const getTopicPages = async (query, rawId) => {
  try {
    const res = await api.get(`/topic-pages/${query}/${rawId}`);
    return res.data;
  } catch (error) {
    console.log('error');
    console.log(error);
    crashlytics().recordError(new Error(error));
    // throw new Error(error);
    return []
  }
};

export {
  // eslint-disable-next-line import/prefer-default-export
  getTopicPages,
};
