import React from 'react';
import {useRecoilValue} from 'recoil';
import useFirebaseRemoteConfig from '../libraries/Configs/RemoteConfig';
import {InitialStartupAtom} from '../service/initialStartup';

export const useUserWhitelist = () => {
  const [isWhitelisted, setWhitelisted] = React.useState(false);
  const userProfile = useRecoilValue(InitialStartupAtom);

  const {isFbrcInitiated, getFirebaseRemoteConfigData} = useFirebaseRemoteConfig();

  React.useEffect(() => {
    const users = getFirebaseRemoteConfigData('user_whitelist');

    if (users?.includes(userProfile.id)) {
      setWhitelisted(true);
    } else {
      setWhitelisted(false);
    }
  }, [userProfile, isFbrcInitiated]);

  return isWhitelisted;
};
