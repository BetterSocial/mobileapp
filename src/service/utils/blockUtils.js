import Toast from 'react-native-simple-toast';

import {blockAnonymous, blockDomain, blockUser, blockUserFromAnonChat} from '../blocking';

const handleMessage = (reason = [], message = '', type = 'user') => {
  let successMessage = `The ${type} was blocked successfully. \nThanks for making Helio better!`;
  if (reason.length > 0 || message.length > 0) {
    successMessage = 'Your report was filed & will be investigated';
  }
  return successMessage;
};

const uiBlockPostAnonymous = async (postId, source, reason, message, callback) => {
  const data = {
    postId,
    source,
    reason,
    message
  };
  try {
    await blockAnonymous(data);
    Toast.show(handleMessage(reason, message), Toast.LONG);

    if (callback) callback();
  } catch (e) {
    Toast.show(String(e.message), Toast.LONG);
  }
};

const uiBlockUser = async (postId, userId, source, reason, message, callback) => {
  const data = {
    userId,
    postId,
    source,
    reason,
    message
  };
  try {
    await blockUser(data);
    Toast.show(handleMessage(reason, message), Toast.LONG);
    if (callback) callback();
  } catch (e) {
    Toast.show(String(e.message), Toast.LONG);
  }
};

const uiBlockDomain = async (domainId, reason, message, source) => {
  const dataBlock = {
    domainId,
    reason,
    message,
    source
  };
  try {
    await blockDomain(dataBlock);
    Toast.show(handleMessage(reason, message, 'domain'), Toast.LONG);
  } catch (e) {
    Toast.show(String(e.message), Toast.LONG);
  }
};

const uiBlockAnonymousUserFromGroupInfo = async (userId, source, reason, message, callback) => {
  const data = {
    userId,
    source,
    reason,
    message
  };
  try {
    await blockUserFromAnonChat(data);
    Toast.show(handleMessage(reason, message), Toast.LONG);
    if (callback) callback();
  } catch (e) {
    Toast.show(String(e.message), Toast.LONG);
  }
};

export default {
  uiBlockAnonymousUserFromGroupInfo,
  uiBlockPostAnonymous,
  uiBlockUser,
  uiBlockDomain
};
