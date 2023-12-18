import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import StorageUtils from '../../../utils/storage';
import dimen from '../../../utils/dimen';
import useMappingPostColorHook from './useMappingColorHook';
import {Context} from '../../../context';
import {FEEDS_CACHE} from '../../../utils/cache/constant';
import {SOURCE_FEED_TAB} from '../../../utils/constants';
import {downVote, upVote} from '../../../service/vote';
import {getFeedDetail, getMainFeedV2WithTargetFeed, viewTimePost} from '../../../service/post';
import {saveToCache} from '../../../utils/cache';
import {
  setFeedByIndex,
  setMainFeeds,
  setTimer,
  setViewPostTimeIndex
} from '../../../context/actions/feeds';

const useCoreFeed = () => {
  const [loading, setLoading] = React.useState(false);
  const [countStack, setCountStack] = React.useState(null);
  const [showNavbar, setShowNavbar] = React.useState(true);
  const [postOffset, setPostOffset] = React.useState(0);
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const [profileContext] = React.useContext(Context).profile;
  const [searchHeight, setSearchHeight] = React.useState(0);
  const [isLastPage, setIsLastPage] = React.useState(false);
  const [isScroll, setIsAlreadyScroll] = React.useState(false);
  const [nextTargetFeed, setNextTargetFeed] = React.useState(null);
  const {feeds, timer, viewPostTimeIndex} = feedsContext;
  const {myProfile} = profileContext;
  const {bottom} = useSafeAreaInsets();
  const {mappingColorFeed} = useMappingPostColorHook();

  const getDataFeeds = async (offsetFeed = 0, useLoading = false, targetFeed = null) => {
    setCountStack(null);
    if (useLoading) {
      setLoading(true);
    }
    try {
      const query = `?offset=${offsetFeed}`;

      const dataFeeds = await getMainFeedV2WithTargetFeed(query, targetFeed);
      if (Array.isArray(dataFeeds.data) && dataFeeds.data?.length <= 0) {
        setLoading(false);
        return setIsLastPage(true);
      }
      return handleDataFeeds(dataFeeds, offsetFeed);
    } catch (e) {
      setLoading(false);
      return e;
    }
  };

  const handleDataFeeds = (dataFeeds, offsetFeed = 0) => {
    if (dataFeeds.data.length > 0) {
      const {data} = dataFeeds;
      const mapNewData = mappingColorFeed(data);
      let saveData = {
        offsetFeed: dataFeeds.offset,
        data: mapNewData,
        targetFeed: dataFeeds?.feed
      };
      if (offsetFeed === 0) {
        setMainFeeds(mapNewData, dispatch);
        StorageUtils.feedPages.set(JSON.stringify(saveData));
      } else {
        const clonedFeeds = [...feeds, ...mapNewData];
        saveData = {
          ...saveData,
          data: clonedFeeds
        };
        setMainFeeds(clonedFeeds, dispatch);
        saveToCache(FEEDS_CACHE, saveData);
      }
      setCountStack(data.length);
    }
    setNextTargetFeed(dataFeeds?.feed);
    setPostOffset(dataFeeds.offset);
    setTimer(new Date(), dispatch);
    setLoading(false);
  };

  const onDeleteBlockedPostCompleted = async (postId) => {
    if (postId) {
      const postIndex = feeds.findIndex((item) => item.id === postId);
      const clonedFeeds = [...feeds];
      clonedFeeds.splice(postIndex, 1);
      setMainFeeds(clonedFeeds, dispatch);
    }
  };

  const onBlockCompleted = async (postId) => {
    onDeleteBlockedPostCompleted(postId);

    return getDataFeeds(0, true);
  };

  const checkCacheFeed = () => {
    const cacheFeed = StorageUtils.feedPages.get();

    if (cacheFeed) {
      const result = JSON.parse(cacheFeed);
      setMainFeeds(result.data, dispatch);
      setPostOffset(result.offset);
      setNextTargetFeed(result.feed);
    }

    getDataFeeds();
  };

  const updateFeed = async (post, index) => {
    try {
      const data = await getFeedDetail(post.activity_id);
      handleUpdateFeed(data, index);
    } catch (e) {
      if (axios.isAxiosError(e)) {
        throw e.response.data;
      }
    }
  };

  const handleUpdateFeed = (data, index) => {
    if (data) {
      setFeedByIndex(
        {
          singleFeed: data.data,
          index
        },
        dispatch
      );
    }
  };
  const setUpVote = async (post, index) => {
    await upVote(post);
    // updateVoteData(index, 'upvote', post, myUpvote)
    updateFeed(post, index);
  };

  const setDownVote = async (post, index) => {
    await downVote(post);
    // updateVoteData(index, 'downvote', post, myDownVote)
    updateFeed(post, index);
  };

  const saveSearchHeight = (height) => {
    if (!searchHeight) {
      setSearchHeight(Number(height));
    }
  };

  const handleScroll = (status) => setIsAlreadyScroll(status);

  React.useEffect(() => {
    if (isLastPage && isScroll) {
      SimpleToast.show(
        'You’ve seen all posts - What about putting your phone aside for a bit?',
        SimpleToast.LONG
      );
    }
  }, [isLastPage, isScroll]);

  const sendViewPostTime = async (withResetTime = false) => {
    const currentTime = new Date();
    const diffTime = currentTime.getTime() - timer.getTime();
    const id = feeds?.[viewPostTimeIndex]?.id;
    if (!id) return;

    viewTimePost(id, diffTime, SOURCE_FEED_TAB);
    if (withResetTime) setTimer(new Date(), dispatch);
  };

  const getCurrentPostViewed = (momentumEvent) => {
    const {y} = momentumEvent.nativeEvent.contentOffset;
    const shownIndex = Math.ceil(y / dimen.size.FEED_CURRENT_ITEM_HEIGHT);
    return shownIndex;
  };

  const updateViewPostTime = (momentumEvent) => {
    setViewPostTimeIndex(getCurrentPostViewed(momentumEvent), dispatch);
    setTimer(new Date(), dispatch);
  };

  const isSamePostViewed = (momentumEvent) => {
    return getCurrentPostViewed(momentumEvent) === viewPostTimeIndex;
  };

  return {
    bottom,
    countStack,
    feeds,
    isScroll,
    loading,
    myProfile,
    nextTargetFeed,
    postOffset,
    profileContext,
    searchHeight,
    showNavbar,
    timer,
    viewPostTimeIndex,

    checkCacheFeed,
    getDataFeeds,
    handleDataFeeds,
    handleScroll,
    handleUpdateFeed,
    isSamePostViewed,
    mappingColorFeed,
    onBlockCompleted,
    onDeleteBlockedPostCompleted,
    saveSearchHeight,
    sendViewPostTime,
    setDownVote,
    setIsLastPage,
    setMainFeeds,
    setPostOffset,
    setSearchHeight,
    setShowNavbar,
    setUpVote,
    updateFeed,
    updateViewPostTime
  };
};

export default useCoreFeed;
