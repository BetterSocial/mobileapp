import * as React from 'react';

import ProfileRepo from '../../service/repo/profileRepo';
import useMyProfileFeedContextHook from '../context/useMyProfileFeedContext';
import StorageUtils from '../../utils/storage';
import useCoreFeed from '../../screens/FeedScreen/hooks/useCoreFeed';
import {getMyProfile} from '../../service/profile';
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
  const [cacheProfile, setProfileCache] = React.useState({});
  const isProfileTabSigned = profileTabIndex === TAB_INDEX_SIGNED;
  const [profileState, dispatchProfile] = React.useContext(Context).profile;

  const setTabIndexToSigned = () => setProfileTabIndex(TAB_INDEX_SIGNED);

  const setTabIndexToAnonymous = () => setProfileTabIndex(TAB_INDEX_ANONYMOUS);

  const fetchAnonymousPost = async (offset = 0, limit = 10) => {
    setIsLoadingFetchingAnonymousPosts(true);
    const cacheFeed = StorageUtils.myAnonymousFeed.get();
    const response = await ProfileRepo.getSelfAnonymousFeed(offset, limit);
    const {data: myAnonymousFeed} = response;
    const {mapNewData} = mappingColorFeed({dataFeed: myAnonymousFeed, dataCache: cacheFeed});
    setMyProfileAnonymousFeed(mapNewData);
    setIsLoadingFetchingAnonymousPosts(false);
  };

  const reloadFetchAnonymousPost = async () => {
    fetchAnonymousPost();
  };

  React.useEffect(() => {
    const cacheAnonymFeed = StorageUtils.myAnonymousFeed.get();
    if (!cacheAnonymFeed) {
      fetchAnonymousPost();
    } else {
      const parseAnonymFeed = JSON.parse(cacheAnonymFeed);
      setMyProfileAnonymousFeed(parseAnonymFeed);
    }
  }, []);

  const fetchMyProfile = async (updateData) => {
    try {
      // if (cacheProfile && !updateData) {
      //   console.log({cacheProfile}, 'zamanbatu');
      //   saveProfileState(cacheProfile);
      //   return cacheProfile?.profile_pic_path;
      // }
      const result = await getMyProfile();
      if (result.code === 200) {
        const {data} = result;
        StorageUtils.profileData.set(JSON.stringify(data));
        // saveProfileState(data);
        return data?.profile_pic_path;
      }
    } catch (e) {
      console.log('get my profile error', e);
    }

    return null;
  };

  const saveProfileCache = (cache) => {
    if (cache && typeof cache === 'string') {
      StorageUtils.profileData.set(cache);
    }
  };

  const getProfileCache = () => {
    const myCacheProfile = StorageUtils.profileData.get();
    console.log(myCacheProfile, 'nakal');
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
