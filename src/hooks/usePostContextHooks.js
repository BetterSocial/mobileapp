import * as React from 'react';

import {Context} from '../context';
import {setMainFeeds, setTopicFeeds} from '../context/actions/feeds';
import {setMyProfileFeed} from '../context/actions/myProfileFeed';
import {setOtherProfileFeed} from '../context/actions/otherProfileFeed';

export const CONTEXT_SOURCE = {
  FEEDS: 'feeds',
  PROFILE_FEEDS: 'profile_feeds',
  OTHER_PROFILE_FEEDS: 'other_profile_feeds',
  TOPIC_FEEDS: 'topic_feeds'
};

const usePostContextHook = (source = CONTEXT_SOURCE.FEEDS) => {
  let feedsContext;
  let dispatch;

  switch (source) {
    case CONTEXT_SOURCE.FEEDS:
      [feedsContext, dispatch] = React.useContext(Context).feeds;
      break;

    case CONTEXT_SOURCE.PROFILE_FEEDS:
      [feedsContext, dispatch] = React.useContext(Context).myProfileFeed;
      break;

    case CONTEXT_SOURCE.OTHER_PROFILE_FEEDS:
      [feedsContext, dispatch] = React.useContext(Context).otherProfileFeed;
      break;

    case CONTEXT_SOURCE.TOPIC_FEEDS:
      [feedsContext, dispatch] = React.useContext(Context).feeds;
      break;
    default:
      break;
  }

  const {feeds} = feedsContext;

  const updateFeedContext = (newFeeds) => {
    switch (source) {
      case CONTEXT_SOURCE.FEEDS:
        setMainFeeds(newFeeds, dispatch);
        break;

      case CONTEXT_SOURCE.PROFILE_FEEDS:
        setMyProfileFeed(newFeeds, dispatch);
        break;

      case CONTEXT_SOURCE.OTHER_PROFILE_FEEDS:
        setOtherProfileFeed(newFeeds, dispatch);
        break;
      case CONTEXT_SOURCE.TOPIC_FEEDS:
        setTopicFeeds(newFeeds, dispatch);
        break;

      default:
        break;
    }
  };

  const deleteCommentFromContext = (postId, commentId, level = 0, updateCallback = null) => {
    const singleFeedIndex = feeds?.findIndex((find) => postId === find?.id);
    const newFeeds = [...feeds];
    const feed = {...newFeeds[singleFeedIndex]};
    if (level === 0) {
      const commentIndex = feed?.latest_reactions?.comment?.findIndex(
        (find) => commentId === find?.id
      );
      feed?.latest_reactions?.comment?.splice(commentIndex, 1);
      const commentCount = feed?.reaction_counts?.comment || 0;
      if (commentCount > 0) {
        feed.reaction_counts.comment -= 1;
      }
      newFeeds[singleFeedIndex] = feed;
      updateFeedContext(newFeeds);
    }

    if (updateCallback && typeof updateCallback === 'function') updateCallback(feed);
  };

  const deleteCommentFromContextByIndex = (feedIndex) => {
    if (__DEV__) {
      console.log(feedIndex);
      console.log(feeds[feedIndex]);
    }
  };

  return {
    deleteCommentFromContext,
    deleteCommentFromContextByIndex,
    updateFeedContext
  };
};

export default usePostContextHook;
