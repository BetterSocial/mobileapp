import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';

import StorageUtils from '../../../utils/storage';
import useUserAuthHook from '../auth/useUserAuthHook';
import {ChannelList} from '../../../../types/database/schema/ChannelList.types';
import {checkFollowStatus} from '../../../service/users';
import {setFollow, setUnFollow} from '../../../service/profile';

export type FollowStatus = {
  isFollowed?: boolean | undefined;
  isFollowing?: boolean | undefined;
  isFollowingFromAction?: boolean | undefined;
};

export type FollowStatusAPI = {
  isMeFollowingTarget?: boolean | undefined;
  isMeFollowingTargetFromAction?: boolean | undefined;
  isTargetFollowingMe?: boolean | undefined;
};

export type WhichTab = 'signed' | 'anonymous';

const useFollowUserV2Hook = (tab: WhichTab = 'signed') => {
  const {signedProfileId, anonProfileId} = useUserAuthHook();

  const [followStatus, setFollowStatus] = React.useState<FollowStatus>({
    isFollowed: undefined,
    isFollowing: undefined,
    isFollowingFromAction: undefined
  });

  async function __helperCallOtherProfileData(channelId: string) {
    if (!channelId) return;

    try {
      const result = await checkFollowStatus(channelId);
      StorageUtils.otherProfileData.setForKey(channelId, JSON.stringify(result));
    } catch (e) {
      console.error('get follow status failed', e);
    }
  }

  const getOtherProfileFollowStatus = async (channelId: string | undefined): Promise<any> => {
    if (!channelId) return;

    let otherProfileDataCache = StorageUtils.otherProfileData.getForKey(channelId);
    let otherProfileDataJSON: FollowStatusAPI = {
      isMeFollowingTargetFromAction: undefined,
      isMeFollowingTarget: undefined,
      isTargetFollowingMe: undefined
    };

    try {
      otherProfileDataJSON = JSON.parse(otherProfileDataCache || '{}');
    } catch (e) {
      console.error(e);
    }

    if (otherProfileDataCache) {
      setFollowStatus({
        isFollowed: otherProfileDataJSON?.isTargetFollowingMe,
        isFollowing: otherProfileDataJSON?.isMeFollowingTarget,
        isFollowingFromAction: otherProfileDataJSON?.isMeFollowingTargetFromAction
      });
    }

    await __helperCallOtherProfileData(channelId);
    otherProfileDataCache = StorageUtils.otherProfileData.getForKey(channelId);
    try {
      otherProfileDataJSON = JSON.parse(otherProfileDataCache || '{}');
    } catch (e) {
      console.error(e);
    }

    setFollowStatus({
      isFollowed: otherProfileDataJSON?.isTargetFollowingMe,
      isFollowing: otherProfileDataJSON?.isMeFollowingTarget,
      isFollowingFromAction: otherProfileDataJSON?.isMeFollowingTargetFromAction
    });
  };

  const followUserAction = async (item: ChannelList) => {
    /**
     * Optimistic state update (START)
     */
    const initialFollowStatus = {...followStatus};
    setFollowStatus((prevFollowStatus) => ({
      ...prevFollowStatus,
      isFollowingFromAction: !initialFollowStatus?.isFollowingFromAction,
      isFollowing: !initialFollowStatus?.isFollowing
    }));

    /**
     * Optimistic state update (END)
     */

    try {
      const myId = tab === 'signed' ? signedProfileId : anonProfileId;
      const targetUser = item?.rawJson?.channel?.members?.find(
        (member) => member?.user_id !== myId
      )?.user;

      const data = {
        user_id_followed: targetUser?.id,
        follow_source: 'chat'
      };

      if (initialFollowStatus?.isFollowing) {
        await setUnFollow(data);
      } else {
        await setFollow(data);
      }
    } catch (e) {
      const action = initialFollowStatus?.isFollowing ? 'unfollow' : 'follow';
      SimpleToast.show(`Failed to ${action} user. Please try again later`);
      /**
       * Revert optimistic update
       */
      setFollowStatus(() => ({
        ...initialFollowStatus
      }));
    }
  };

  return {
    followStatus,

    followUserAction,
    getOtherProfileFollowStatus
  };
};

export default useFollowUserV2Hook;
