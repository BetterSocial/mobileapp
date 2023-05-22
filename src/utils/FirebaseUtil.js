import remoteConfig from '@react-native-firebase/remote-config';

import firebaseRemoteConfig, {FETCH_INTERVAL_IN_MINUTES} from '../configs/FirebaseRemoteConfig';

// set defaults
remoteConfig().setDefaults(firebaseRemoteConfig);

// fetch remote Configs
export const fetchRemoteConfig = () => {
  // data is locally cached for FETCH_INTERVAL_IN_MINUTES
  const fetch = remoteConfig().fetch(FETCH_INTERVAL_IN_MINUTES * 60);
  return fetch
    .then(() => remoteConfig().fetchAndActivate())
    .then(() => {
      return remoteConfig().getAll();
    })
    .then((res) => {
      return res;
    })
    .catch((err) => {
      if (__DEV__) {
        console.log('remote Configs error: ', err);
      }
    });
};

export default fetchRemoteConfig;
