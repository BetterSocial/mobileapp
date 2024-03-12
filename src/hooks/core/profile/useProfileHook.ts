import * as React from 'react';
import {useRecoilState} from 'recoil';

import profileAtom from '../../../atom/profileAtom';
import {Context} from '../../../context';
import {ProfileContext} from '../../../../types/context/profilecontext.types';

/**
 *
 * @deprecated Please use useUserAuthHook instead
 */
const useProfileHook = () => {
  // TODO: Merge this with useUserAuthHook and delete this hook
  const contextValue = React.useContext(Context);
  const profile = contextValue ? contextValue.profile : null;

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
    profile: profileContext ? profileContext.myProfile : null,
    signedProfileId,
    anonProfileId,
    setProfileId,
    reset
  };
};

export default useProfileHook;
