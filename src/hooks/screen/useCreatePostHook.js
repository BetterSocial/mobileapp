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
  const [selectedTopic, setSelectedTopic] = React.useState(topic);
  const [anonUserInfo, setAnonUserInfo] = React.useState(null);
  const [headerTitle, setHeaderTitle] = React.useState(
    selectedTopic ? `Create Post in #${selectedTopic}` : 'Create Post'
  );

  const isInCreatePostTopicScreen = !!selectedTopic;

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

  React.useEffect(() => {
    setHeaderTitle(selectedTopic ? `Create Post in #${selectedTopic}` : 'Create Post');
  }, [selectedTopic]);

  return {
    headerTitle,
    initialTopic: selectedTopic ? [selectedTopic] : [],
    isInCreatePostTopicScreen,
    refreshAnonUserInfo,
    anonUserInfo,
    setSelectedTopic
  };
};

export default useCreatePostHook;
