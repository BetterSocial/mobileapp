import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

export const createPost = async (data) => {
  try {
    const resApi = await api.post('/activity/post-v3', {
      ...data,
      with_system_message: true
    });
    return resApi.data;
  } catch (error) {
    if (__DEV__) {
      console.log('CreatePost API: ', error.response);
    }
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

export const createPollPost = async (data) => {
  try {
    const resApi = await api.post('/activity/post-v3', data);

    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

export const createFeedToken = async (data) => {
  try {
    const resApi = await api.post('/activity/create-token', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

export const ShowingAudience = async (privacy, location) => {
  try {
    const resApi = await api.get(
      `/users/showing-audience-estimates?privacy=${privacy}&location=${location}`
    );
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
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

export const getMainFeedV2WithTargetFeed = async (query, targetFeed = null) => {
  if (typeof targetFeed === 'string') {
    query += `&feed=${targetFeed}`;
  }

  try {
    const res = await api.get(`/activity/feeds-v2${query}`);
    if (res?.status === 200 && res?.data?.status === 'success') {
      return Promise.resolve(res?.data);
    }
    return Promise.reject(new Error('Failed to get feeds.'));
  } catch (err) {
    crashlytics().recordError(err.response.data);
    return Promise.reject(err);
  }
};

export const getFeedDetail = async (id) => {
  try {
    const resApi = await api.get(`/feeds/detail-feed?id=${id}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    throw error;
  }
};

export const inputSingleChoicePoll = async (polling_id, polling_option_id) => {
  try {
    const resApi = await api.post('/activity/post/poll/input', {
      polling_id,
      polling_option_id
    });

    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    return error;
  }
};

export const viewTimePost = async (id, time, source) => {
  // SimpleToast.show(`view post duration : ${time / 1000}s in ${source}`);
  try {
    const resApi = api.post('/activity/viewpost', {
      post_id: id,
      view_time: time,
      source
    });
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    return error;
  }
};

export const deletePost = async (postId) => {
  try {
    const resApi = await api.delete(`/activity/${postId}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error?.response?.data);
    if (__DEV__) {
      console.log('delete post error: ', error);
    }
    return error;
  }
};

export const deleteAnonymousPost = async (postId) => {
  try {
    const resApi = await api.delete(`/activity/anonymous/${postId}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error?.response?.data);
    if (__DEV__) {
      console.log('delete post error: ', error);
    }
    return error;
  }
};

export const isAuthorFollowingMe = async (postId) => {
  try {
    const resApi = await api.get(`/activity/post/is-author-follow-me/${postId}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error?.response?.data);
    return error;
  }
};
