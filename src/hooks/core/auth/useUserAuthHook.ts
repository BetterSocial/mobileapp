import * as React from 'react';
import {useRecoilState} from 'recoil';

import profileAtom from '../../../atom/profileAtom';
import {Context} from '../../../context';
import {ProfileContext} from '../../../../types/context/profilecontext.types';

const useUserAuthHook = () => {
  const [profile] = React.useContext(Context).profile;
  const profileContext = profile as ProfileContext;

  const [authAtomState, setAuth] = useRecoilState(profileAtom);

  const {anonProfileId, signedProfileId, token, anonymousToken} = authAtomState;

  const resetAuth = () =>
    setAuth({
      signedProfileId: null,
      anonProfileId: null,
      token: null,
      anonymousToken: null
    });

  const isMe = (profileId: string | undefined): boolean => {
    if (!profileId) return false;
    return profileId === signedProfileId || profileId === anonProfileId;
  };

  return {
    profile: profileContext.myProfile,
    signedProfileId,
    anonProfileId,
    token,
    anonymousToken,

    isMe,
    resetAuth,
    setAuth
  };
};

export default useUserAuthHook;
