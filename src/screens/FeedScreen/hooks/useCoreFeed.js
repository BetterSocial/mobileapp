import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import {Context} from '../../../context';
import {FEEDS_CACHE} from '../../../utils/cache/constant';
import {downVote, upVote} from '../../../service/vote';
import {getFeedDetail, getMainFeedV2WithTargetFeed} from '../../../service/post';
import {getSpecificCache, saveToCache} from '../../../utils/cache';
import {setFeedByIndex, setMainFeeds, setTimer} from '../../../context/actions/feeds';
import {listFeedColor} from '../../../configs/FeedColor';
import StorageUtils from '../../../utils/storage';

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

  const handleBgContentFeed = (anonymColor) => {
    // console.log({dataFeed}, 'jamaludin');
    if (anonymColor) {
      const findColor = listFeedColor.find((color) => color.bg == anonymColor);
      console.log({findColor}, 'kurama');
      return {
        bg: anonymColor,
        color: findColor?.color || 'rgba(255,255,255,0.7)'
      };
    }
    const randomIndex = Math.floor(Math.random() * listFeedColor.length);
    return listFeedColor[randomIndex];
  };

  const getDataFeeds = async (offsetFeed = 0, useLoading = false, targetFeed = null) => {
    setCountStack(null);
    if (useLoading) {
      setLoading(true);
    }
    try {
      const query = `?offset=${offsetFeed}`;

      const dataFeeds = await getMainFeedV2WithTargetFeed(query, targetFeed);
      console.log('boban2', {dataFeeds});
      if (Array.isArray(dataFeeds.data) && dataFeeds.data?.length <= 0) {
        setLoading(false);
        return setIsLastPage(true);
      }
      return handleDataFeeds(dataFeeds, offsetFeed);
    } catch (e) {
      console.log(e, 'boban4');
      setLoading(false);
      return e;
    }
  };

  const handleDataFeeds = (dataFeeds, offsetFeed = 0) => {
    if (dataFeeds.data.length > 0) {
      const {data} = dataFeeds;
      const mapNewData = data?.map((feed) => ({
        ...feed,
        bgColor: handleBgContentFeed().bg,
        color: handleBgContentFeed(feed?.anon_user_info_color_code)
      }));
      console.log({mapNewData}, 'boban7');
      const dataWithDummy = [...mapNewData, {dummy: true}];
      let saveData = {
        offsetFeed: dataFeeds.offset,
        data: dataWithDummy,
        targetFeed: dataFeeds?.feed
      };
      if (offsetFeed === 0) {
        setMainFeeds(dataWithDummy, dispatch);
        saveToCache(FEEDS_CACHE, saveData);
        StorageUtils.feedPages.set(JSON.stringify(saveData));
        console.log('jalan');
      } else {
        const clonedFeeds = [...feeds];
        clonedFeeds.splice(feeds.length - 1, 0, ...data);
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

  const checkCacheFeed = async () => {
    const cacheFeed = StorageUtils.feedPages.get();
    console.log({cacheFeed}, 'boban1');
    if (cacheFeed) {
      console.log('boban3');
      getDataFeeds();
    } else {
      const result = JSON.parse(cacheFeed);
      setMainFeeds(result.data, dispatch);
      setPostOffset(result.offset);
      setNextTargetFeed(result.feed);
      console.log('boban5', {cacheFeed: JSON.parse(cacheFeed)});
    }

    // getSpecificCache(FEEDS_CACHE, (result) => {
    //   console.log('boban6', {result});
    //   if (result) {
    //     setMainFeeds(result.data, dispatch);
    //     setPostOffset(result.offset);
    //     setNextTargetFeed(result.feed);
    //   } else {
    //     getDataFeeds();
    //   }
    // });
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

  return {
    getDataFeeds,
    loading,
    countStack,
    postOffset,
    showNavbar,
    profileContext,
    searchHeight,
    setSearchHeight,
    timer,
    viewPostTimeIndex,
    setPostOffset,
    setShowNavbar,
    myProfile,
    bottom,
    onDeleteBlockedPostCompleted,
    onBlockCompleted,
    checkCacheFeed,
    updateFeed,
    setUpVote,
    setDownVote,
    saveSearchHeight,
    setMainFeeds,
    feeds,
    handleDataFeeds,
    handleUpdateFeed,
    handleScroll,
    isScroll,
    setIsLastPage,
    nextTargetFeed,
    handleBgContentFeed
  };
};

export default useCoreFeed;
