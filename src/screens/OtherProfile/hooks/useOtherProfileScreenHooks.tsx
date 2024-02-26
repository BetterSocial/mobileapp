import * as React from 'react';
import SimpleToast from 'react-native-simple-toast';

import StorageUtils from '../../../utils/storage';
import {Context} from '../../../context';
import {checkUserBlock, getOtherProfile} from '../../../service/profile';
import {setOtherProfileFeed} from '../../../context/actions/otherProfileFeed';

const useOtherProfileScreenHooks = (targetUserProfileId: string, username: string) => {
  /**
   * State
   */
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isProfileFetching, setIsProfileFetching] = React.useState<boolean>(true);
  const [isBlocked, setIsBlocked] = React.useState<boolean | undefined>(undefined);
  const [isBlocking, setIsBlocking] = React.useState<boolean | undefined>(undefined);
  const [otherProfileData, setOtherProfileData] = React.useState<any>({});
  const [, setOtherProfileUserId] = React.useState<string>('');

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

  const fetchOtherProfileData = async () => {
    try {
      const result = await getOtherProfile(username);
      if (result.code === 200) {
        const data = result?.data;
        setOtherProfileData(data);
        setOtherProfileUserId(data.user_id);

        StorageUtils.otherProfileData.setForKey(targetUserProfileId, JSON.stringify(data));
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
    await getCache();

    await Promise.all([fetchBlockStatus(true), fetchOtherProfileData(), fetchFeeds()]);

    setIsProfileFetching(false);
    setIsLoading(false);
  };

  React.useEffect(() => {
    initData();

    return () => {
      setOtherProfileFeed([], dispatchOtherProfile);
    };
  }, []);

  return {
    feeds,
    otherProfileData,
    isBlocked,
    isBlocking,
    isLoading,
    isProfileFetching,

    refetchOtherProfile: () => fetchOtherProfileData(),
    refetchBlockStatus: () => fetchBlockStatus(false),

    setOtherProfileData
  };
};

export default useOtherProfileScreenHooks;
