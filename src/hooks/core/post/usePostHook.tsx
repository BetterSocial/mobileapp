import React from 'react';

import TopicPageStorage from '../../../utils/storage/custom/topicPageStorage';
import removePrefixTopic from '../../../utils/topics/removePrefixTopic';
import {Context} from '../../../context';
import {followUserAnon, setFollow, setUnFollow, unfollowUserAnon} from '../../../service/profile';
import {setMainFeeds, setTopicFeeds} from '../../../context/actions/feeds';

export type FollowAction = 'follow' | 'unfollow' | 'follow-anonymous' | 'unfollow-anonymous';

const usePostHook = () => {
  const [profileContext] = (React.useContext(Context) as any).profile;
  const [feedsContext, feedsContextDispatch] = (React.useContext(Context) as any).feeds;
  const {myProfile} = profileContext;

  const followUnfollow = async (item: any): Promise<FollowAction | null> => {
    const user_id = item?.actor?.id;
    const username = item?.actor?.data?.username;
    const data = {
      user_id_follower: myProfile?.user_id,
      user_id_followed: user_id,
      username_follower: myProfile?.username,
      username_followed: username,
      follow_source: 'feed'
    };
    const dataFollowAnon = {
      follow_source: 'post',
      post_id: item?.id
    };

    let followAction: FollowAction | null = null;

    const indexFeed = feedsContext?.feeds?.findIndex((feed) => {
      return feed?.id === item?.id;
    });
    const feedData = feedsContext?.feeds[indexFeed];
    if (feedData?.is_following_target) {
      if (!feedData?.anon_user_info_color_name) {
        feedsContext?.feeds.forEach((feed, index) => {
          if (feed?.actor?.id === user_id) {
            feedsContext.feeds[index] = {...feedsContext?.feeds[index], is_following_target: false};
          }
        });
        followAction = 'unfollow';
        setUnFollow(data);
      } else {
        const newFeed = {...feedsContext?.feeds[indexFeed], is_following_target: false};
        feedsContext.feeds[indexFeed] = newFeed;
        unfollowUserAnon(dataFollowAnon);
        followAction = 'unfollow-anonymous';
      }
    } else if (!feedData?.anon_user_info_color_name) {
      feedsContext?.feeds.forEach((feed, index) => {
        if (feed?.actor?.id === user_id) {
          feedsContext.feeds[index] = {...feedsContext?.feeds[index], is_following_target: true};
        }
      });
      setFollow(data);
      followAction = 'follow';
    } else {
      const newFeed = {...feedsContext?.feeds[indexFeed], is_following_target: true};
      feedsContext.feeds[indexFeed] = newFeed;
      followUserAnon(dataFollowAnon);
      followAction = 'follow-anonymous';
    }
    setMainFeeds(feedsContext.feeds, feedsContextDispatch);

    return followAction;
  };

  const followUnfollowTopic = async (
    item: any,
    topic: string,
    offset: number
  ): Promise<FollowAction | null> => {
    const id = removePrefixTopic(topic);
    const feedTopic = feedsContext.topicFeeds
      ? feedsContext.topicFeeds.filter((feed) => feed?.topics?.includes(id))
      : [];
    const feedMain = feedsContext.feeds;
    let followAction: FollowAction | null = null;

    const user_id = item?.actor?.id;
    const username = item?.actor?.data?.username;
    const data = {
      user_id_follower: myProfile?.user_id,
      user_id_followed: user_id,
      username_follower: myProfile?.username,
      username_followed: username,
      follow_source: 'feed'
    };
    const dataFollowAnon = {
      follow_source: 'post',
      post_id: item?.id
    };
    const indexFeed = feedTopic?.findIndex((feed) => {
      return feed?.id === item?.id;
    });
    const feedData = feedTopic[indexFeed];
    if (feedData?.is_following_target) {
      if (!feedData?.anon_user_info_color_name) {
        feedTopic.forEach((feed, index) => {
          if (feed?.actor?.id === user_id) {
            feedTopic[index] = {...feedTopic[index], is_following_target: false};
          }
        });
        feedMain.forEach((feed, index) => {
          if (feed?.actor?.id === user_id) {
            feedMain[index] = {...feedMain[index], is_following_target: false};
          }
        });
        setUnFollow(data);
        followAction = 'unfollow';
      } else {
        feedTopic[indexFeed] = {...feedTopic[indexFeed], is_following_target: false};
        feedMain[indexFeed] = {...feedMain[indexFeed], is_following_target: false};
        unfollowUserAnon(dataFollowAnon);
        followAction = 'unfollow-anonymous';
      }
    } else if (!feedData?.anon_user_info_color_name) {
      feedTopic.forEach((feed, index) => {
        if (feed?.actor?.id === user_id) {
          feedTopic[index] = {...feedTopic[index], is_following_target: true};
        }
      });
      feedMain.forEach((feed, index) => {
        if (feed?.actor?.id === user_id) {
          feedMain[index] = {...feedMain[index], is_following_target: true};
        }
      });
      setFollow(data);
      followAction = 'follow';
    } else {
      feedTopic[indexFeed] = {...feedTopic[indexFeed], is_following_target: true};
      feedMain[indexFeed] = {...feedMain[indexFeed], is_following_target: true};
      followUserAnon(dataFollowAnon);
      followAction = 'follow-anonymous';
    }
    TopicPageStorage.set(id?.toLowerCase(), feedTopic, offset);
    setTopicFeeds(feedTopic, feedsContextDispatch);
    setMainFeeds(feedMain, feedsContextDispatch);

    return followAction;
  };

  return {
    followUnfollow,
    followUnfollowTopic
  };
};

export default usePostHook;
