import {useEffect} from 'react';

import OneSignalUtil from '../../../service/onesignal';
import {getUserId} from '../../../utils/users';

const useOneSignalSubscribeToCommunityHooks = () => {
  const loginToOneSignal = async () => {
    try {
      const userId = await getUserId();
      console.log('login to onesignal', userId);
      OneSignalUtil.login(userId);
    } catch (e) {
      console.log(e);
    }
  };
  useEffect(() => {
    loginToOneSignal();
  }, []);
};

export default useOneSignalSubscribeToCommunityHooks;
