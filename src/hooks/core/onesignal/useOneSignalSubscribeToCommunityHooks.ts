import {OneSignal} from 'react-native-onesignal';
import {useEffect} from 'react';
import {useSetRecoilState} from 'recoil';

import OneSignalUtil from '../../../service/onesignal';
import onesignalNavigationAtom from '../../../atom/onesignalNavigationAtom';
import {OneSignalTopicNotificationData} from './types.d';

const useOneSignalSubscribeToCommunityHooks = () => {
  const setOneSignalNavigationAtom = useSetRecoilState(onesignalNavigationAtom);

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
        setOneSignalNavigationAtom({
          screen: 'TopicPageScreen',
          params: additionalData
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
