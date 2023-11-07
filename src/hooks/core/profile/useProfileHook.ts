import * as React from 'react';
import {useRecoilState} from 'recoil';

import profileAtom from '../../../atom/profileAtom';
import {Context} from '../../../context';
import {ProfileContext} from '../../../../types/context/profilecontext.types';

const useProfileHook = () => {
  // TODO: Merge this with useUserAuthHook and delete this hook
  const [profile] = React.useContext(Context).profile;
  const profileContext = profile as ProfileContext;

  const [profileAtomState, setProfileId] = useRecoilState(profileAtom);

  const {anonProfileId, signedProfileId} = profileAtomState;

  const reset = () => {
    setProfileId({
      signedProfileId: null,
      anonProfileId: null,
      token: null,
      anonymousToken: null
    });
  };

  return {
    profile: profileContext.myProfile,
    signedProfileId,
    anonProfileId,
    setProfileId,
    reset
  };
};

export default useProfileHook;
