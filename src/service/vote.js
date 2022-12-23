import SimpleToast from 'react-native-simple-toast';
import crashlytics from '@react-native-firebase/crashlytics';
import Toast from 'react-native-toast-message';

import StringConstant from '../utils/string/StringConstant';
import api from './config';
import { getSpecificCache, saveToCache } from '../utils/cache';
import { FIRST_VOTE } from '../utils/cache/constant';

const handleToast = (type) => {
    getSpecificCache(FIRST_VOTE, (cache) => {
    if(!cache) {
       Toast.show({
            type: 'center',
            text1: `Post ${type}.`,
            text2: 'Your upvotes & downvotes are private',
            autoHide: true,
            visibilityTime: 8000,
            position: 'bottom',
    });
    }
  })
}

const saveCacheVote = () => {
  saveToCache(FIRST_VOTE, {isVote: true})
}

export const upVote = async (data) => {
  try {
    const resApi = await api.post('/activity/upvote', data);
    handleToast('upvotes')
    saveCacheVote()
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    return error
  }
};

export const downVote = async (data) => {
  try {

    const resApi = await api.post('/activity/downvote', data);
    handleToast('downvotes')
    saveCacheVote()
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    return error
  }
};
export const upVoteDomain = async (data) => {
  try {
    const resApi = await api.post('/activity/upvote-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.upvoteFailedText, SimpleToast.SHORT);
    return error
  }
};

export const downVoteDomain = async (data) => {
  try {
    const resApi = await api.post('/activity/downvote-domain', data);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    SimpleToast.show(StringConstant.downvoteFailedText, SimpleToast.SHORT);
    return error
  }
};
export const voteComment = async (data) => {
  try {
    const resApi = await api.post('/activity/vote_comment', data);
    return resApi.data;
  } catch (error) {
    console.log('error ', error);
    crashlytics().recordError(new Error(error));
    return error
  }
};
export const iVoteComment = async (id) => {
  try {
    const resApi = await api.get(`/activity/i_vote_comment?id=${id}`);
    return resApi.data;
  } catch (error) {
    crashlytics().recordError(new Error(error));
    return error
  }
};
