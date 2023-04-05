import * as React from 'react';

import {Context} from '../../context';
import {SET_MY_PROFILE_ANON_FEED, SET_MY_PROFILE_FEED} from '../../context/Types';

const useMyProfileFeedContextHook = () => {
  const [myProfileFeed, dispatch] = React.useContext(Context).myProfileFeed;
  const {feeds, anonymousFeeds} = myProfileFeed;

  const setMyProfileFeed = (payload) => {
    dispatch({type: SET_MY_PROFILE_FEED, payload});
  };

  const setMyProfileAnonymousFeed = (payload) => {
    dispatch({type: SET_MY_PROFILE_ANON_FEED, payload});
  };

  const setMyProfileFeedByIndex = (index, payload) => {
    const newFeeds = [...feeds];
    newFeeds[index] = payload;
    setMyProfileFeed(newFeeds);
  };

  const setMyProfileAnonymousFeedByIndex = (index, payload) => {
    const newFeeds = [...anonymousFeeds];
    newFeeds[index] = payload;
    setMyProfileAnonymousFeed(newFeeds);
  };

  return {
    feeds,
    anonymousFeeds,
    setMyProfileAnonymousFeed,
    setMyProfileAnonymousFeedByIndex,
    setMyProfileFeed,
    setMyProfileFeedByIndex
  };
};

export default useMyProfileFeedContextHook;
