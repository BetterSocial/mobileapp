import crashlytics from '@react-native-firebase/crashlytics';

import anonymousApi from './anonymousConfig';
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
  try {
    const resApi = await api.post('/activity/comment-v2', data);
    return resApi.data;
  } catch (error) {
    console.log(error?.message);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const createCommentParentV3 = async (data) => {
  let resApi;
  try {
    if (data?.anonimity) resApi = await anonymousApi.post('/activity/comment-v3-anonymous', data);
    else resApi = await api.post('/activity/comment-v3', data);
    return resApi.data;
  } catch (error) {
    console.log(error?.message);
    crashlytics().recordError(new Error(error));
    throw new Error(error);
  }
};

const createCommentDomainParentV2 = async (data) => {
  try {
    const resApi = await api.post('/activity/comment-domain-v2', data);
    return resApi.data;
  } catch (error) {
    console.log(error?.message);
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
    console.log(data, 'nusuk');
    const resApi = await api.post('/activity/comment-child-v2', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    throw new Error(error);
  }
};

const createChildCommentV3 = async (
  text,
  reactionId,
  sendPostNotif,
  activityId,
  isAnonymous,
  anonUser
) => {
  try {
    let resApi;
    let data = {
      reaction_id: reactionId,
      message: text,
      sendPostNotif,
      activityId,
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
      resApi = await anonymousApi.post('/activity/comment-child-v3-anonymous', data);
    } else {
      resApi = await api.post('/activity/comment-child-v3', data);
    }

    return resApi.data;
  } catch (error) {
    crashlytics().recordError(error.response.data);
    console.log(error?.response?.data);
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

const getCommentList = async (activity_id, params) => {
  try {
    const url = `feeds/reaction-list/${activity_id}?${params}`;
    const response = await api.get(url);
    return response;
  } catch (e) {
    crashlytics().recordError(e.response.data);
    throw new Error(e);
  }
};

export {
  createCommentParent,
  createCommentDomainParentV2,
  createChildComment,
  createChildCommentV3,
  deleteComment,
  createCommentParentV2,
  createCommentParentV3,
  getCommentList
};
