import {useCallback, useState} from 'react';

import remoteConfig from '@react-native-firebase/remote-config';
import isEmpty from 'lodash/isEmpty';

const useFirebaseRemoteConfig = () => {
  const [initState, setInitState] = useState(false);
  const initializeFirebaseRemoteConfig = useCallback(async () => {
    try {
      await remoteConfig().setDefaults({
        user_whitelist: []
      });
      await remoteConfig().fetch(__DEV__ ? 0 : 300); // Time in seconds for telling firebase the cache duration, IF __DEV__ don't cache it ELSE cache for 5 mins
      const status = await remoteConfig().activate();
      if (__DEV__) {
        console.log(
          `Firebase Remote Config status: ${status ? 'Already activated' : 'Just activated'}`
        );
      }
    } catch (error) {
      if (__DEV__) {
        console.log(
          'useFirebaseRemoteConfig.ts | firebase remote config initialization failed',
          error
        );
      }
    }
    setInitState(true);
  }, []);

  const getFirebaseRemoteConfigData = (key) => {
    const data = remoteConfig().getValue(key).asString();

    if (!isEmpty(data)) {
      return JSON.parse(data);
    }
    return undefined;
  };

  return {
    isFbrcInitiated: initState,
    initializeFirebaseRemoteConfig,
    getFirebaseRemoteConfigData
  };
};

export default useFirebaseRemoteConfig;
