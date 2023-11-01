import {OneSignal} from 'react-native-onesignal';
import {useEffect} from 'react';
import {useNavigation} from '@react-navigation/core';

import OneSignalUtil from '../../../service/onesignal';
import useUserAuthHook from '../auth/useUserAuthHook';
import getFeatureLoggerInstance, {EFeatureLogFlag} from '../../../utils/log/FeatureLog';
import {OneSignalTopicNotificationData} from './types.d';

const {featLog} = getFeatureLoggerInstance(EFeatureLogFlag.useOneSignalSubscribeToCommunityHooks);

const useOneSignalSubscribeToCommunityHooks = () => {
  const navigation = useNavigation();
  const {token, signedProfileId} = useUserAuthHook();

  const loginToOneSignal = async () => {
    featLog('login to one signal', token, signedProfileId);
    try {
      OneSignalUtil.setExternalId(signedProfileId);
      await OneSignalUtil.rebuildAndSubscribeTags();
    } catch (e) {
      console.log('error one signal login ');
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
    if (token && signedProfileId) {
      loginToOneSignal();
      addNotificationListener();
    }
  }, [token, signedProfileId]);
};

export default useOneSignalSubscribeToCommunityHooks;
