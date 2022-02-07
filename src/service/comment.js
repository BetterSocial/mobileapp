import api from './config';
import crashlytics from '@react-native-firebase/crashlytics';

const createCommentParent = async (text, activityId, useridFeed) => {
  try {
    let data = {
      activity_id: activityId,
      message: text,
      useridFeed,
    };

    let resApi = await api.post('/activity/comment', data);
    return resApi.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const createChildComment = async (text, reactionId) => {
  try {
    let data = {
      reaction_id: reactionId,
      message: text,
    };

    let resApi = await api.post('/activity/child-comment', data);
    return resApi.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

export {createCommentParent, createChildComment};
