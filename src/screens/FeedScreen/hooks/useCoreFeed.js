import React from 'react';
import SimpleToast from 'react-native-simple-toast';
import axios from 'axios';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import StorageUtils from '../../../utils/storage';
import {Context} from '../../../context';
import {FEEDS_CACHE} from '../../../utils/cache/constant';
import {checkIsHasColor, hexToRgb} from '../../../utils/colors';
import {downVote, upVote} from '../../../service/vote';
import {getFeedDetail, getMainFeedV2WithTargetFeed} from '../../../service/post';
import {listFeedColor} from '../../../configs/FeedColor';
import {saveToCache} from '../../../utils/cache';
import {setFeedByIndex, setMainFeeds, setTimer} from '../../../context/actions/feeds';

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

  const handleBgContentFeed = (feed) => {
    if (feed.anon_user_info_color_code) {
      const rgb = hexToRgb(feed?.anon_user_info_color_code, 0.25);
      const color = {
        bg: `${rgb}`,
        color: 'rgba(0,0,0)'
      };
      return color;
    }
    const randomIndex = getRandomInt(0, listFeedColor.length);
    let newColor = listFeedColor[randomIndex];
    newColor = {
      ...newColor,
      bg: hexToRgb(newColor.bg, 0.25),
      color: 'rgba(0,0,0)'
    };
    return newColor;
  };

  const mappingColorFeed = ({dataFeed, dataCache}) => {
    if (dataCache && typeof dataCache === 'string') {
      dataCache = JSON.parse(dataCache);
    }
    const mapNewData = dataFeed?.map((feed) => {
      const cacheBg = dataCache?.find((cache) => cache?.id === feed?.id);
      if (cacheBg?.bg) {
        const isHexColor = checkIsHasColor(cacheBg.bg);
        if (isHexColor) {
          return {...feed, bg: hexToRgb(cacheBg.bg, 0.25)};
        }
        return {...feed, bg: cacheBg?.bg};
      }
      return {...feed, ...handleBgContentFeed(feed)};
    });

    return {
      mapNewData
    };
  };

  const handleDataFeeds = (dataFeeds, offsetFeed = 0) => {
    if (dataFeeds.data.length > 0) {
      const {data} = dataFeeds;
      let stringCacheFeed = StorageUtils.feedPages.get();
      if (stringCacheFeed) {
        stringCacheFeed = JSON.parse(stringCacheFeed);
      } else {
        stringCacheFeed = {};
      }
      const {mapNewData} = mappingColorFeed({dataFeed: data, dataCache: stringCacheFeed?.data});
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

  const getRandomInt = (min, max) => {
    // Create byte array and fill with 1 random number
    const byteArray = new Uint8Array(1);
    // eslint-disable-next-line no-undef
    crypto.getRandomValues(byteArray);

    const range = max - min + 1;
    const max_range = 256;
    if (byteArray[0] >= Math.floor(max_range / range) * range) return getRandomInt(min, max);
    return min + (byteArray[0] % range);
  };

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
    mappingColorFeed
  };
};

export default useCoreFeed;
