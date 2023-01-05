import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const createCommentParent = async (text, activityId, useridFeed, sendPostNotif) => {
  try {
    const data = {
      activity_id: activityId,
      message: text,
      useridFeed,
      sendPostNotif,
    };

    console.log('data to comment')
    console.log(data)

    const resApi = await api.post('/activity/comment', data);
    return resApi.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const createChildComment = async (text, reactionId, useridFeed, sendPostNotif, postMaker) => {
  try {
    const data = {
      reaction_id: reactionId,
      message: text,
      useridFeed,
      sendPostNotif,
      postMaker
    };

    const resApi = await api.post('/activity/child-comment', data);
    return resApi.data;
  } catch (error) {
    console.log(error);
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

const deleteComment = async (reactionId) => {
  try {
    const payload = {
      reaction_id: reactionId
    }

    const resApi = await api.post('/activity/delete-reaction', payload)
    return resApi?.data
  } catch (error) {
    console.log(error);
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
}

export { createCommentParent, createChildComment, deleteComment };
