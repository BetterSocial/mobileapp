import SimpleToast from 'react-native-simple-toast';
import crashlytics from '@react-native-firebase/crashlytics';

import StringConstant from '../utils/string/StringConstant';
import api from './config';
import {FIRST_VOTE} from '../utils/cache/constant';
import {getSpecificCache, saveToCache} from '../utils/cache';

const handleToast = (type) => {
  const message = type === 'upvoted' ? 'upvotes' : 'downvotes';
  getSpecificCache(FIRST_VOTE, (cache) => {
    if (!cache) {
      SimpleToast.show(`Post ${type}. All ${message} are private.`, SimpleToast.LONG);
    }
  });
};

const saveCacheVote = () => {
  saveToCache(FIRST_VOTE, {isVote: true});
};

export const voteCommentV2 = async (data) => {
  try {
    const resApi = await api.post('/feeds/comment-vote-v2', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    return error;
  }
};

export const upVote = async (data, callback) => {
  try {
    const resApi = await api.post('/activity/upvote', data);
    handleToast('upvoted');
    saveCacheVote();
    if (callback) callback();
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    return error;
  }
};

export const downVote = async (data, callback) => {
  try {
    const resApi = await api.post('/activity/downvote', data);
    handleToast('downvoted');
    saveCacheVote();
    if (callback) callback();
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    return error;
  }
};
export const upVoteDomain = async (data) => {
  try {
    const resApi = await api.post('/activity/upvote-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    return error;
  }
};

export const downVoteDomain = async (data) => {
  try {
    const resApi = await api.post('/activity/downvote-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    return error;
  }
};
export const voteComment = async (data) => {
  try {
    const resApi = await api.post('/activity/vote_comment', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error;
  }
};

export const iVoteComment = async (id) => {
  try {
    const resApi = await api.get(`/activity/i_vote_comment?id=${id}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error;
  }
};
