import * as React from 'react';
import {showMessage} from 'react-native-flash-message';
import {useRoute} from '@react-navigation/core';

import AnonUserInfoRepo from '../../service/repo/anonUserInfoRepo';

/**
 *
 * @param {boolean} isAnonymous
 * @returns
 */
const useCreatePostHook = (isAnonymous) => {
  const {params = {}} = useRoute();
  const {topic, isCreateCommunity} = params;
  const [anonUserInfo, setAnonUserInfo] = React.useState(null);

  const headerTitle = isCreateCommunity
    ? 'Create first post'
    : topic
    ? `Create Post in #${topic}`
    : 'Create Post';

  const isInCreatePostTopicScreen = !!topic;

  const getAnonUserInfo = React.useCallback(async () => {
    try {
      const response = await AnonUserInfoRepo.getPostAnonUserInfo();
      if (response.isSuccess) {
        setAnonUserInfo(response.data);
      } else {
        showMessage({
          message: response.error,
          type: 'danger'
        });
      }
    } catch (e) {
      console.log('Error in getAnonUserInfo', e);
      showMessage({
        message: e,
        type: 'danger'
      });
    }
  }, []);

  const refreshAnonUserInfo = React.useCallback(() => {
    getAnonUserInfo();
  }, []);

  React.useEffect(() => {
    getAnonUserInfo();
  }, []);

  React.useEffect(() => {
    if (!isAnonymous) getAnonUserInfo();
  }, [isAnonymous]);

  return {
    headerTitle,
    initialTopic: topic ? [topic] : [],
    isInCreatePostTopicScreen,
    refreshAnonUserInfo,
    anonUserInfo
  };
};

export default useCreatePostHook;
