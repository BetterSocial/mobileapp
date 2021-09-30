import crashlytics from '@react-native-firebase/crashlytics';
import api from './config';

export const upVote = async (data) => {
  try {
    let resApi = await api.post('/activity/upvote', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const downVote = async (data) => {
  try {
    let resApi = await api.post('/activity/downvote', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
export const upVoteDomain = async (data) => {
  try {
    let resApi = await api.post('/activity/upvote-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};

export const downVoteDomain = async (data) => {
  try {
    let resApi = await api.post('/activity/downvote-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
export const voteComment = async (data) => {
  try {
    let resApi = await api.post('/activity/vote_comment', data);
    return resApi.data;
  } catch (error) {
    console.log('error ', error);
    crashlytics().recordError(new Error(error));
    return error.response.data;
  }
};
