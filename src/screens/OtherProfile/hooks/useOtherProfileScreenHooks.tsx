import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';
import {useRoute} from '@react-navigation/core';

import StorageUtils from '../../../utils/storage';
import useDiscovery from '../../DiscoveryScreenV2/hooks/useDiscovery';
import {Context} from '../../../context';
import {checkUserBlock, getOtherProfile} from '../../../service/profile';
import {setOtherProfileFeed} from '../../../context/actions/otherProfileFeed';
import {setUserId} from '../../../utils/token';

export type OtherProfileRouteParams = {
  data: {
    user_id: string;
    other_id: string;
    username: string;
    following: boolean;
  };
};

const useOtherProfileScreenHooks = (targetUserProfileId: string, username: string) => {
  const {updateFollowDiscoveryContext, getIsMeFollowingTargetStatus} = useDiscovery();
  const route = useRoute();
  const params = route.params as OtherProfileRouteParams;

  /**
   * State
   */
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isProfileFetching, setIsProfileFetching] = React.useState<boolean>(true);
  const [isBlocked, setIsBlocked] = React.useState<boolean | undefined>(undefined);
  const [isBlocking, setIsBlocking] = React.useState<boolean | undefined>(undefined);
  const [otherProfileData, setOtherProfileData] = React.useState<any>({});
  const [, setOtherProfileUserId] = React.useState<string>('');
  const [other_id, setOtherId] = React.useState('');
  const [isCurrentFollowed, setIsCurrentFollowed] = React.useState(
    getIsMeFollowingTargetStatus(params.data.other_id, params?.data?.username) ||
      params?.data?.following
  );

  /**
   * Other Profile Context
   */
  const [otherProfileFeeds, dispatchOtherProfile] = (React.useContext(Context) as any)
    ?.otherProfileFeed;
  const {feeds} = otherProfileFeeds;

  const getCache = async () => {
    const isBlockedFromCache = StorageUtils.blockedStatus.getForKey(targetUserProfileId) === 'true';
    const isBlockingFromCache =
      StorageUtils.blockingStatus.getForKey(targetUserProfileId) === 'true';

    try {
      const otherProfileDataCache =
        StorageUtils.otherProfileData.getForKey(targetUserProfileId) || '{}';
      setOtherProfileData(JSON.parse(otherProfileDataCache));
      if (otherProfileDataCache !== '{}') {
        setIsProfileFetching(false);
      }
    } catch (e) {
      console.log('error parsing JSON other profile data', e);
    }

    try {
      const feedsCache = StorageUtils.otherProfileFeed.getForKey(targetUserProfileId) || '[]';

      setOtherProfileFeed(JSON.parse(feedsCache), dispatchOtherProfile);
    } catch (e) {
      console.log('error parsing JSON other profile feed', e);
    }

    setIsBlocked(isBlockedFromCache);
    setIsBlocking(isBlockingFromCache);
  };

  const fetchFeeds = async () => {
    setIsLoading(true);
    setIsLoading(false);
  };

  const fetchOtherProfileData = async (): Promise<any> => {
    try {
      const result = await getOtherProfile(username);
      if (result.code === 200) {
        const data = result?.data;
        setOtherProfileData(data);
        setOtherProfileUserId(data.user_id);
        updateFollowDiscoveryContext(data?.is_me_following_target, data);
        setIsCurrentFollowed(data?.is_me_following_target);
        setOtherId(data?.user_id);

        StorageUtils.otherProfileData.setForKey(targetUserProfileId, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.log('error fetching other profile data', e);
      if (e?.response?.data?.message) {
        SimpleToast.show(e.response.data.message, SimpleToast.SHORT);
      }
    }
  };

  const fetchBlockStatus = async (withFeedsFetching = false) => {
    const sendData = {
      user_id: targetUserProfileId
    };
    try {
      const processGetBlock = await checkUserBlock(sendData);
      if (processGetBlock.status === 200) {
        const isBlockedFromApi = processGetBlock.data.data.blocked;
        const isBlockingFromApi = processGetBlock.data.data.blocker;

        setIsBlocked(isBlockedFromApi);
        setIsBlocking(isBlockingFromApi);

        StorageUtils.blockedStatus.setForKey(targetUserProfileId, isBlockedFromApi.toString());
        StorageUtils.blockingStatus.setForKey(targetUserProfileId, isBlockingFromApi.toString());

        if (withFeedsFetching) await fetchFeeds();
      }
    } catch (e) {
      console.log('error fetching block status', e);
    }
  };

  const initData = async () => {
    setUserId(params?.data?.user_id);
    setOtherProfileData({});
    await getCache();

    await Promise.all([fetchBlockStatus(true), fetchOtherProfileData(), fetchFeeds()]);

    setIsProfileFetching(false);
    setIsLoading(false);
  };

  React.useEffect(() => {
    initData();

    return () => {
      setOtherProfileFeed([], dispatchOtherProfile);
      setOtherProfileData(null);
    };
  }, []);

  return {
    username,
    feeds,
    otherProfileData,
    isBlocked,
    isBlocking,
    isLoading,
    isProfileFetching,
    isCurrentFollowed,
    otherUserId: other_id,
    selfUserId: params?.data?.user_id,

    refetchOtherProfile: () => fetchOtherProfileData(),
    refetchBlockStatus: () => fetchBlockStatus(false),

    setOtherProfileData,
    setIsCurrentFollowed
  };
};

export default useOtherProfileScreenHooks;
