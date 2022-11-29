
import React from 'react'
import axios from 'axios';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Context } from '../../../context';
import { getFeedDetail, getMainFeed } from '../../../service/post';
import { getSpecificCache, saveToCache } from '../../../utils/cache';
import { FEEDS_CACHE } from '../../../utils/cache/constant';
import { setFeedByIndex, setMainFeeds, setTimer } from '../../../context/actions/feeds';
import { upVote, downVote } from '../../../service/vote';

const useCoreFeed = () => {
const [loading, setLoading] = React.useState(false);
const [countStack, setCountStack] = React.useState(null);
const [showNavbar, setShowNavbar] = React.useState(true)
const [postOffset, setPostOffset] = React.useState(0)
const [feedsContext, dispatch] =  React.useContext(Context).feeds;
const [profileContext] = React.useContext(Context).profile;
const [searchHeight, setSearchHeight] = React.useState(0)

const { feeds, timer, viewPostTimeIndex } = feedsContext;
  const { myProfile } = profileContext
    const { bottom } = useSafeAreaInsets();

  const getDataFeeds = async (offsetFeed = 0, useLoading) => {
    setCountStack(null);
    if (useLoading) {
      setLoading(true);
    }
    try {
      const query = `?offset=${offsetFeed}`

      const dataFeeds = await getMainFeed(query);
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
      return dataFeeds
    } catch (e) {
      setLoading(false);
      return e
    }
  };

const onDeleteBlockedPostCompleted = async (postId) => {
    const postIndex = feeds.findIndex((item) => item.id === postId)
    const clonedFeeds = [...feeds]
    clonedFeeds.splice(postIndex, 1)
    setMainFeeds(clonedFeeds, dispatch)
  }

const onBlockCompleted = async (postId) => {
    onDeleteBlockedPostCompleted(postId)

    const resp = await getDataFeeds(0, true)
    return resp
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
      if (data) {
        setFeedByIndex(
          {
            singleFeed: data.data,
            index,
          },
          dispatch,
        );
      }
    } catch (e) {
        if(axios.isAxiosError(e)) {
            throw e.response.data
        }
    }
  };

    const setUpVote = async (post, index) => {
        try {
            const processVote = await upVote(post);
            updateFeed(post, index);
            return processVote;
        }catch (e) {
            if(axios.isAxiosError(e)) {
                throw e.response.data
            }
            return e
        }

  };

    const setDownVote = async (post, index) => {
        try {
            const processVote = await downVote(post);
            updateFeed(post, index);
            return processVote
        } catch (e) {
            if(axios.isAxiosError(e)) {
                throw e.response.data
            }
            return e
        }
    
  };

    const saveSearchHeight = (height) => {
    if (!searchHeight) {
      setSearchHeight(Number(height))

    }
  }

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
    saveSearchHeight
  }
}


export default useCoreFeed