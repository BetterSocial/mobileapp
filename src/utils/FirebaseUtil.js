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
      //   return {
      //     FORCE_UPDATE_APP_STORE_URL: snapshot.FORCE_UPDATE_APP_STORE_URL.asString(),
      //     IS_APPLICATION_ON: !!snapshot.IS_APPLICATION_ON.asBoolean(),
      //     IS_ANNOUNCEMENTS_ON: !!snapshot.IS_ANNOUNCEMENTS_ON.asBoolean(),
      //   };
      //   let data = snapshot.enable_chat.asBoolean();
      //   console.log(data);
      Object.entries(res).forEach(() => {
        // const [key, entry] = $;
      });
      return res;
    })
    .catch((err) => {
      if (__DEV__) {
        console.log('remote Configs error: ', err);
      }
      // firebaseRemoteConfig;
    });
};

export default fetchRemoteConfig;
