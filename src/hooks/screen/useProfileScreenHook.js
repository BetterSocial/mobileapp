import * as React from 'react';

import ProfileRepo from '../../service/repo/profileRepo';
import useMyProfileFeedContextHook from '../context/useMyProfileFeedContext';
import StorageUtils from '../../utils/storage';
import useCoreFeed from '../../screens/FeedScreen/hooks/useCoreFeed';

export const TAB_INDEX_SIGNED = 0;
export const TAB_INDEX_ANONYMOUS = 1;

const useProfileScreenHook = () => {
  const [profileTabIndex, setProfileTabIndex] = React.useState(TAB_INDEX_SIGNED);
  const [isLoadingFetchingAnonymousPosts, setIsLoadingFetchingAnonymousPosts] =
    React.useState(false);
  const [isLoadingFetchingSignedPosts] = React.useState(false);
  const {feeds, anonymousFeeds, setMyProfileAnonymousFeed} = useMyProfileFeedContextHook();
  const {mappingColorFeed} = useCoreFeed();
  const isProfileTabSigned = profileTabIndex === TAB_INDEX_SIGNED;

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

  return {
    isLoadingFetchingAnonymousPosts,
    isLoadingFetchingSignedPosts,
    feeds: isProfileTabSigned ? feeds : anonymousFeeds,
    setTabIndexToAnonymous,
    setTabIndexToSigned,
    reloadFetchAnonymousPost,
    fetchAnonymousPost,
    profileTabIndex,
    isProfileTabSigned
  };
};

export default useProfileScreenHook;
