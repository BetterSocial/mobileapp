import React from 'react';
import {CONTEXT_SOURCE} from './usePostContextHooks';
import {Context} from '../context';

export const useFeedDataContext = (contextSource) => {
  const [feeds, dispatchFeed] = React.useContext(Context).feeds;
  const [otherFeeds, dispatchOtherFeed] = React.useContext(Context).otherProfileFeed;
  const [myProfileFeed, dispatchProfileFeed] = React.useContext(Context).myProfileFeed;

  if (contextSource === CONTEXT_SOURCE.FEEDS) {
    return [feeds, dispatchFeed];
  }

  if (contextSource === CONTEXT_SOURCE.OTHER_PROFILE_FEEDS) {
    return [otherFeeds, dispatchOtherFeed];
  }

  if (contextSource === CONTEXT_SOURCE.PROFILE_FEEDS) {
    return [myProfileFeed, dispatchProfileFeed];
  }

  return [null, () => {}];
};
