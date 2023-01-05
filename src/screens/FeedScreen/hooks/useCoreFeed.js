import React from 'react';
import axios from 'axios';
import SimpleToast from 'react-native-simple-toast';

import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Context } from '../../../context';
import { FEEDS_CACHE } from '../../../utils/cache/constant';
import { downVote, upVote } from '../../../service/vote';
import { getFeedDetail, getMainFeed } from '../../../service/post';
import { getSpecificCache, saveToCache } from '../../../utils/cache';
import { setFeedByIndex, setMainFeeds, setTimer } from '../../../context/actions/feeds';

const useCoreFeed = () => {
const [loading, setLoading] = React.useState(false);
const [countStack, setCountStack] = React.useState(null);
const [showNavbar, setShowNavbar] = React.useState(true)
const [postOffset, setPostOffset] = React.useState(0)
const [feedsContext, dispatch] =  React.useContext(Context).feeds;
const [profileContext] = React.useContext(Context).profile;
const [searchHeight, setSearchHeight] = React.useState(0)
const [isLastPage, setIsLastPage] = React.useState(false)

const { feeds, timer, viewPostTimeIndex } = feedsContext;
const { myProfile } = profileContext
const { bottom } = useSafeAreaInsets();

  const getDataFeeds = async (offsetFeed = 0, useLoading) => {
    setCountStack(null);
    setIsLastPage(false)
    if (useLoading) {
      setLoading(true);
    }
    try {
      const query = `?offset=${offsetFeed}`

      const dataFeeds = await getMainFeed(query);
      if(Array.isArray(dataFeeds.data) && dataFeeds.data.length <= 0) {
        setLoading(false)
        return setIsLastPage(true)
      }
      handleDataFeeds(dataFeeds, offsetFeed)
    } catch (e) {
      setLoading(false);
      return e
    }
  };

const handleDataFeeds = (dataFeeds, offsetFeed = 0) => {
   if (dataFeeds.data.length > 0) {
        const { data } = dataFeeds;
        const dataWithDummy = [...data, { dummy: true }]
        let saveData = {
          offsetFeed: dataFeeds.offset,
          data: dataWithDummy

        }
        if (offsetFeed === 0) {
          setMainFeeds(dataWithDummy, dispatch);
          saveToCache(FEEDS_CACHE, saveData)
        } else {
          const clonedFeeds = [...feeds]
          clonedFeeds.splice(feeds.length - 1, 0, ...data)
          saveData = {
            ...saveData,
            data: clonedFeeds
          }
          setMainFeeds(clonedFeeds, dispatch);
          saveToCache(FEEDS_CACHE, saveData)
        }
        setCountStack(data.length);
      }
      setPostOffset(dataFeeds.offset)
      setTimer(new Date(), dispatch)
      setLoading(false);
}

const onDeleteBlockedPostCompleted = async (postId) => {
    if(postId) {
      const postIndex = feeds.findIndex((item) => item.id === postId)
      const clonedFeeds = [...feeds]
      clonedFeeds.splice(postIndex, 1)
      setMainFeeds(clonedFeeds, dispatch)
    }
  }

const onBlockCompleted = async (postId) => {
    onDeleteBlockedPostCompleted(postId)

    return getDataFeeds(0, true)
  }

    const checkCacheFeed = () => {
    getSpecificCache(FEEDS_CACHE, (result) => {
      if (result) {
        setMainFeeds(result.data, dispatch)
        setPostOffset(result.offset)

      } else {
        getDataFeeds()
      }
    })
  }

    const updateFeed = async (post, index) => {
    try {
      const data = await getFeedDetail(post.activity_id);
      handleUpdateFeed(data, index)
    } catch (e) {
        if(axios.isAxiosError(e)) {
            throw e.response.data
        }
    }
  };

  const handleUpdateFeed = (data, index) => {
    if (data) {
        setFeedByIndex(
          {
            singleFeed: data.data,
            index,
          },
          dispatch,
        );
      }
  }
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
      setSearchHeight(Number(height))

    }
  }

  React.useEffect(() => {
    if(isLastPage) {
      SimpleToast.show('You’ve seen all posts - What about putting your phone aside for a bit?', SimpleToast.LONG)

    }
  }, [isLastPage])

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
    handleUpdateFeed
  }
}


export default useCoreFeed