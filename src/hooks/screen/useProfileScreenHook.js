import * as React from 'react';
import netInfo from '@react-native-community/netinfo';

import ProfileRepo from '../../service/repo/profileRepo';
import StorageUtils from '../../utils/storage';
import useCoreFeed from '../../screens/FeedScreen/hooks/useCoreFeed';
import useMyProfileFeedContextHook from '../context/useMyProfileFeedContext';
import {Context} from '../../context';
import {setMyProfileAction} from '../../context/actions/setMyProfileAction';

export const TAB_INDEX_SIGNED = 0;
export const TAB_INDEX_ANONYMOUS = 1;

const useProfileScreenHook = () => {
  const [profileTabIndex, setProfileTabIndex] = React.useState(TAB_INDEX_SIGNED);
  const [isLoadingFetchingAnonymousPosts, setIsLoadingFetchingAnonymousPosts] =
    React.useState(false);
  const [isLoadingFetchingSignedPosts] = React.useState(false);
  const {feeds, anonymousFeeds, setMyProfileAnonymousFeed} = useMyProfileFeedContextHook();
  const {mappingColorFeed} = useCoreFeed();
  const [cacheProfile] = React.useState({});
  const isProfileTabSigned = profileTabIndex === TAB_INDEX_SIGNED;
  const [, dispatchProfile] = React.useContext(Context).profile;

  const setTabIndexToSigned = () => setProfileTabIndex(TAB_INDEX_SIGNED);

  const setTabIndexToAnonymous = () => setProfileTabIndex(TAB_INDEX_ANONYMOUS);

  const fetchAnonymousPost = async (offset = 0, limit = 10) => {
    setIsLoadingFetchingAnonymousPosts(true);
    const response = await ProfileRepo.getSelfAnonymousFeed(offset, limit);
    const {data: myAnonymousFeed} = response;
    const mapNewData = mappingColorFeed(myAnonymousFeed);
    StorageUtils.myAnonymousFeed.set(JSON.stringify(mapNewData));
    setMyProfileAnonymousFeed(mapNewData);
    setIsLoadingFetchingAnonymousPosts(false);
  };

  const reloadFetchAnonymousPost = async () => {
    fetchAnonymousPost();
  };

  const initMyAnonymousFeed = async () => {
    const cacheAnonymFeed = StorageUtils.myAnonymousFeed.get();
    const status = await netInfo.fetch();
    if (!status.isConnected) {
      const parseAnonymFeed = JSON.parse(cacheAnonymFeed);
      setMyProfileAnonymousFeed(parseAnonymFeed);
    } else {
      fetchAnonymousPost();
    }
  };

  React.useEffect(() => {
    initMyAnonymousFeed();
  }, []);

  const saveProfileCache = (cache) => {
    if (cache && typeof cache === 'string') {
      StorageUtils.profileData.set(cache);
    }
  };

  const getProfileCache = () => {
    const myCacheProfile = StorageUtils.profileData.get();
    if (myCacheProfile) {
      setMyProfileAction(JSON.parse(myCacheProfile), dispatchProfile);
    }
  };

  return {
    isLoadingFetchingAnonymousPosts,
    isLoadingFetchingSignedPosts,
    feeds: isProfileTabSigned ? feeds : anonymousFeeds,
    setTabIndexToAnonymous,
    setTabIndexToSigned,
    reloadFetchAnonymousPost,
    fetchAnonymousPost,
    profileTabIndex,
    isProfileTabSigned,
    saveProfileCache,
    getProfileCache,
    cacheProfile
  };
};

export default useProfileScreenHook;
