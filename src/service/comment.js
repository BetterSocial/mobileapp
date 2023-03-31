import crashlytics from '@react-native-firebase/crashlytics';

import api from './config';

const createCommentParent = async (text, activityId, useridFeed, sendPostNotif) => {
  try {
    const data = {
      activity_id: activityId,
      message: text,
      useridFeed,
      sendPostNotif
    };

    const resApi = await api.post('/activity/comment', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const createCommentParentV2 = async (data) => {
  console.log(data, 'nani');
  try {
    const resApi = await api.post('/activity/comment-v2', data);
    console.log(resApi, 'nana');
    return resApi.data;
  } catch (error) {
    console.log(error, 'error pak');
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const createChildComment = async (
  text,
  reactionId,
  useridFeed,
  sendPostNotif,
  postMaker,
  activityId,
  postTitle,
  isAnonymous,
  anonUser
) => {
  try {
    let data = {
      reaction_id: reactionId,
      message: text,
      sendPostNotif,
      activityId,
      postTitle,
      anonimity: isAnonymous
    };
    const anonimity = {
      emoji_name: anonUser.emojiName,
      color_name: anonUser.colorName,
      emoji_code: anonUser.emojiCode,
      color_code: anonUser.colorCode,
      is_anonymous: isAnonymous
    };
    if (isAnonymous) {
      data = {...data, anon_user_info: anonimity};
    }
    console.log(anonimity, 'cheetah');
    const resApi = await api.post('/activity/comment-child-v2', data);
    return resApi.data;
  } catch (error) {
    console.log(error, 'eman');
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

const deleteComment = async (reactionId) => {
  try {
    const payload = {
      reaction_id: reactionId
    };

    const resApi = await api.post('/activity/delete-reaction', payload);
    return resApi?.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

export {createCommentParent, createChildComment, deleteComment, createCommentParentV2};
