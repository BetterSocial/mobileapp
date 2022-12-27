import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

export const createPost = async (data) => {
  try {
    const resApi = await api.post('/activity/post', data);
    return resApi.data;
  } catch (error) {
    console.log(error)
    crashlytics().recordError(error.response.data);
  }
};

export const createPollPost = async (data) => new Promise(async (resolve, reject) => {
  try {
    const resApi = await api.post(
      '/activity/post/poll',
      data,
      // headers : {
      //   "Authorization" : getstreamToken
      // }
    );

    resolve(resApi.data);
  } catch (error) {
    crashlytics().recordError(error.response.data);
    reject(error);
  }
});

export const createFeedToken = async (data) => new Promise(async (resolve, reject) => {
  try {
    const resApi = await api.post('/activity/create-token', data);
    resolve(resApi.data);
  } catch (error) {
    crashlytics().recordError(error.response.data);
    // console.log(error);
    reject(error);
  }
});

export const ShowingAudience = async (privacy, location) => {
  try {
    const resApi = await api.get(
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
    const res = await api.get(`/activity/feeds${query}`);
    return res.data;
  } catch (err) {
    crashlytics().recordError(err.response.data);
    return err.response.data;
  }
};
export const getFeedDetail = async (id) => {
  try {
    const resApi = await api.get(`/feeds/detail-feed?id=${id}`);
    return resApi.data;
  } catch (error) {
    // crashlytics().recordError(error.response.data);
    return null;
  }
};

export const inputSingleChoicePoll = async (polling_id, polling_option_id) => {
  try {
    const resApi = await api.post('/activity/post/poll/input', {
      polling_id,
      polling_option_id,
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    console.log('vote error');
    console.log(error);
    return error;
  }
};

export const viewTimePost = async (id, time, source) => {
  // SimpleToast.show(`view post duration : ${time / 1000}s in ${source}`);
  try {
    const resApi = api.post('/activity/viewpost', {
      post_id: id,
      view_time: time,
      source,
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    // console.log(error);
    return error;
  }
};

export const deletePost = async (postId) => {
  try {
    const resApi = await api.delete(`/activity/${postId}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error?.response?.data);
    console.log('delete post error');
    console.log(error);
    return error;
  }
}