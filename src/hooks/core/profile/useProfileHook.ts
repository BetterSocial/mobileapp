import * as React from 'react';

import {Context} from '../../../context';
import {ProfileContext} from '../../../../types/context/profilecontext.types';

const useProfileHook = () => {
  const [profile] = React.useContext(Context).profile;
  const profileContext = profile as ProfileContext;

  return {
    profile: profileContext.myProfile
  };
};

export default useProfileHook;
