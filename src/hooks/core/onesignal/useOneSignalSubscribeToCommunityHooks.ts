import {OneSignal} from 'react-native-onesignal';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';

import OneSignalUtil from '../../../service/onesignal';
import {OneSignalTopicNotificationData} from './types.d';

const useOneSignalSubscribeToCommunityHooks = () => {
  const navigation = useNavigation();

  const loginToOneSignal = async () => {
    try {
      await OneSignalUtil.rebuildAndSubscribeTags();
    } catch (e) {
      console.log(e);
    }
  };

  const addNotificationListener = async () => {
    OneSignal.Notifications.addEventListener('click', (event) => {
      const additionalData = event?.notification?.additionalData as OneSignalTopicNotificationData;
      if (additionalData?.community) {
        navigation.navigate('TopicPageScreen', {
          id: additionalData?.community
        });
      }
    });
  };

  useEffect(() => {
    loginToOneSignal();
    addNotificationListener();
  }, []);
};

export default useOneSignalSubscribeToCommunityHooks;
