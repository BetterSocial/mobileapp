import React from 'react';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import following from '../../../context/actions/following';
import {Context} from '../../../context';
import {getFollowedDomain} from '../../../service/domain';
import {getFollowing} from '../../../service/profile';
import {getFollowingTopic} from '../../../service/topics';

const useDiscovery = () => {
  const [, followingDispatch] = React.useContext(Context).following;
  const [refreshing, setRefreshing] = React.useState(false);
  const [isRefreshControlShown, setIsRefreshControlShown] = React.useState(false);
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;

  const users = React.useMemo(() => {
    return discovery.initialUsers.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery]);

  const exchangeFollower = (newUserLists, willFollow, userId) => {
    const indexUser = newUserLists.findIndex((item) =>
      item.user ? item.user.user_id === userId : item.user_id === userId
    );

    if (indexUser < 0) return null;

    if (newUserLists[indexUser].user) {
      newUserLists[indexUser].user.following = !!willFollow;
      newUserLists[indexUser].user.is_followed = !!willFollow;
    } else {
      newUserLists[indexUser].following = !!willFollow;
      newUserLists[indexUser].is_followed = !!willFollow;
    }
    return newUserLists[indexUser];
  };

  const topicExchangeFollower = (newTopicLists, willFollow, topicId, fromTopicPage) => {
    let indexTopic;
    if (fromTopicPage) {
      indexTopic = newTopicLists.findIndex((item) => item.name === topicId);
    } else {
      indexTopic = newTopicLists.findIndex((item) => item.topic_id === topicId);
    }
    newTopicLists[indexTopic].following = !!willFollow;
    return newTopicLists[indexTopic];
  };

  const mapUserWith = (listReference, newUser) => {
    return listReference.map((user) => {
      if (user.user) {
        if (user.user.user_id === newUser.user.user_id) return newUser;
      } else if (user.user_id === newUser.user_id) return newUser;
      return user;
    });
  };

  const topics = React.useMemo(() => {
    return discovery.initialTopics.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery.initialTopics]);

  const mapTopic = (newTopic) => {
    return discovery.initialTopics.map((topic) => {
      if (topic.topic_id === newTopic.topic_id) {
        return newTopic;
      }
      return topic;
    });
  };

  const updateFollowDiscoveryContext = (willFollow, item) => {
    const newFollowedUsers = [...users];
    const userId = item.user ? item.user.user_id : item.user_id;

    // Update initial users
    const newInitialUser = exchangeFollower(newFollowedUsers, willFollow, userId);
    if (newInitialUser !== null)
      DiscoveryAction.setDiscoveryInitialUsers(
        mapUserWith([...discovery?.initialUsers], newInitialUser),
        discoveryDispatch
      );

    // Update discovery search users followed section
    const newSearchFollowedUser = exchangeFollower(discovery?.followedUsers, willFollow, userId);
    if (newSearchFollowedUser !== null)
      DiscoveryAction.setNewFollowedUsers(
        mapUserWith([...discovery?.followedUsers], newSearchFollowedUser),
        discoveryDispatch
      );

    // Update discovery search users unfollowed section
    const newSearchUnfollowedUser = exchangeFollower(
      discovery?.unfollowedUsers,
      willFollow,
      userId
    );
    if (newSearchUnfollowedUser !== null)
      DiscoveryAction.setNewUnfollowedUsers(
        mapUserWith([...discovery?.unfollowedUsers], newSearchUnfollowedUser),
        discoveryDispatch
      );
  };

  const updateFollowTopicDiscoveryContext = (willFollow, item, fromTopicPage) => {
    const newFollowedTopics = [...topics];
    const newTopic = topicExchangeFollower(
      newFollowedTopics,
      willFollow,
      item.topic_id,
      fromTopicPage
    );
    DiscoveryAction.setDiscoveryInitialTopics(mapTopic(newTopic), discoveryDispatch);
  };

  const onRefreshDiscovery = async () => {
    try {
      setRefreshing(true);
      await getFollowing().then((response) => {
        following.setFollowingUsers(response.data, followingDispatch);
      });

      await getFollowedDomain().then((response) => {
        following.setFollowingDomain(response.data.data, followingDispatch);
      });

      await getFollowingTopic().then((response) => {
        console.log({response}, 'likak');
        following.setFollowingTopics(response.data, followingDispatch);
      });
      setRefreshing(false);
    } catch (e) {
      setRefreshing(false);
    }
  };

  const getIsMeFollowingTargetStatus = React.useCallback(
    (userId, username) => {
      function findUser(user) {
        const isUsernameSame =
          user?.username?.toLocaleLowerCase() === username?.toLocaleLowerCase();
        const isUserIdSame = user?.user_id === userId;

        if (username && username.length > 0) {
          return isUserIdSame || isUsernameSame;
        }

        return isUserIdSame;
      }
      const targetUser = discovery?.initialUsers?.find(findUser);
      const targetUserFromFollowed = discovery?.followedUsers?.find(findUser);
      const targetUserFromFollowing = discovery?.unfollowedUsers?.find(findUser);

      return (
        targetUser?.is_followed ||
        targetUserFromFollowed?.is_followed ||
        targetUserFromFollowing?.is_followed ||
        false
      );
    },
    [discovery]
  );

  return {
    refreshing,
    topics,
    users,
    isRefreshControlShown,

    exchangeFollower,
    getIsMeFollowingTargetStatus,
    mapTopic,
    onRefreshDiscovery,
    setIsRefreshControlShown,
    topicExchangeFollower,
    updateFollowDiscoveryContext,
    updateFollowTopicDiscoveryContext
  };
};

export default useDiscovery;
