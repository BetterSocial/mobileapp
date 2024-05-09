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
  const {topic} = params;
  const [anonUserInfo, setAnonUserInfo] = React.useState(null);

  const headerTitle = topic ? `Create Post in #${topic}` : 'Create Post';

  const isInCreatePostTopicScreen = !!topic;

  const getAnonUserInfo = React.useCallback(async () => {
    try {
      const response = await AnonUserInfoRepo.getPostAnonUserInfo();
      setAnonUserInfo(response.data);
    } catch (e) {
      console.log('Error in getAnonUserInfo', e);
      showMessage({
        message: JSON.stringify(e),
        type: 'danger'
      });
    }
  }, []);

  const refreshAnonUserInfo = React.useCallback(() => {
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
