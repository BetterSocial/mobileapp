import * as React from 'react';
import {useRecoilState} from 'recoil';

import profileAtom from '../../../atom/profileAtom';
import {Context} from '../../../context';
import {ProfileContext} from '../../../../types/context/profilecontext.types';
import {setFollow, setUnFollow} from '../../../service/profile';

const useProfileHook = () => {
  const [profile] = React.useContext(Context).profile;
  const profileContext = profile as ProfileContext;

  const [profileAtomState, setProfileId] = useRecoilState(profileAtom);

  const {anonProfileId, signedProfileId} = profileAtomState;

  const onFollowUser = async (other_id, username_followed, source) => {
    try {
      const data = {
        user_id_follower: profile.myProfile.user_id,
        user_id_followed: other_id,
        username_follower: profile.myProfile.username,
        username_followed,
        follow_source: source || 'other-profile'
      };
      const result = await setFollow(data);
      console.log({result}, 'nakal');
      return result;
    } catch (e) {
      console.log(e, 'eman');
      return e;
    }
  };

  const onUnfollowUser = async (other_id, source) => {
    const data = {
      user_id_follower: profile.myProfile.user_id,
      user_id_followed: other_id,
      follow_source: source || 'other-profile'
    };
    const result = await setUnFollow(data);
    return result;
  };

  return {
    profile: profileContext.myProfile,
    signedProfileId,
    anonProfileId,
    setProfileId,
    onFollowUser,
    onUnfollowUser
  };
};

export default useProfileHook;
