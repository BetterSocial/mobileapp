import api from './config';
import crashlytics from '@react-native-firebase/crashlytics';
export const createPost = async (data) => {
  console.log(data);
  try {
    let resApi = await api.post('/activity/post', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    console.log(error.response.data);
  }
};

export const createPollPost = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let resApi = await api.post(
        '/activity/post/poll',
        data,
        // headers : {
        //   "Authorization" : getstreamToken
        // }
      );
      console.log(resApi);
      resolve(resApi.data);
    } catch (error) {
      console.log('API Error');
      console.log(error);
      crashlytics().recordError(error.response.data);
      reject(error);
    }
  });
};

export const createFeedToken = async (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let resApi = await api.post('/activity/create-token', data);
      resolve(resApi.data);
    } catch (error) {
      crashlytics().recordError(error.response.data);
      console.log(error);
      reject(error);
    }
  });
};

export const ShowingAudience = async (privacy, location) => {
  try {
    let resApi = await api.get(
      `/users/showing-audience-estimates?privacy=${privacy}&location=${location}`,
    );
    return resApi.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
  }
};

export const getMainFeed = async (query) => {
  try {
    let res = await api.get('/activity/feeds' + query);
    return res.data;
  } catch (err) {
    crashlytics().recordError(new Error(err));
  }
};
