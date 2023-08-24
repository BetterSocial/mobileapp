import * as React from 'react';

import ProfileRepo from '../../service/repo/profileRepo';
import useMyProfileFeedContextHook from '../context/useMyProfileFeedContext';

export const TAB_INDEX_SIGNED = 0;
export const TAB_INDEX_ANONYMOUS = 1;

const useProfileScreenHook = () => {
  const [profileTabIndex, setProfileTabIndex] = React.useState(TAB_INDEX_SIGNED);
  const [isLoadingFetchingAnonymousPosts, setIsLoadingFetchingAnonymousPosts] =
    React.useState(false);
  const [isLoadingFetchingSignedPosts] = React.useState(false);
  const {feeds, anonymousFeeds, setMyProfileAnonymousFeed} = useMyProfileFeedContextHook();

  const isProfileTabSigned = profileTabIndex === TAB_INDEX_SIGNED;

  const setTabIndexToSigned = () => setProfileTabIndex(TAB_INDEX_SIGNED);

  const setTabIndexToAnonymous = () => setProfileTabIndex(TAB_INDEX_ANONYMOUS);

  const fetchAnonymousPost = async (offset = 0, limit = 10) => {
    setIsLoadingFetchingAnonymousPosts(true);
    const response = await ProfileRepo.getSelfAnonymousFeed(offset, limit);
    setMyProfileAnonymousFeed(response?.data);
    setIsLoadingFetchingAnonymousPosts(false);
  };

  const reloadFetchAnonymousPost = async () => {
    fetchAnonymousPost();
  };

  React.useEffect(() => {
    fetchAnonymousPost();
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
