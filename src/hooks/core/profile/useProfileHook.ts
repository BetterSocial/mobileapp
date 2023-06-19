import * as React from 'react';
import {useRecoilState} from 'recoil';

import profileAtom from '../../../atom/profileAtom';
import {Context} from '../../../context';
import {ProfileContext} from '../../../../types/context/profilecontext.types';

const useProfileHook = () => {
  const [profile] = React.useContext(Context).profile;
  const profileContext = profile as ProfileContext;

  const [profileAtomState, setProfileId] = useRecoilState(profileAtom);

  const {anonProfileId, signedProfileId} = profileAtomState;

  return {
    profile: profileContext.myProfile,
    signedProfileId,
    anonProfileId,
    setProfileId
  };
};

export default useProfileHook;
