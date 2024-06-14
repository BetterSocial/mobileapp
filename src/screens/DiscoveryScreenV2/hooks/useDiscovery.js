import React from 'react';

import DiscoveryAction from '../../../context/actions/discoveryAction';
import following from '../../../context/actions/following';
import {Context} from '../../../context';
import {
  FROM_FOLLOWED_USERS,
  FROM_FOLLOWED_USERS_INITIAL,
  FROM_UNFOLLOWED_USERS,
  FROM_UNFOLLOWED_USERS_INITIAL,
  FROM_USERS_INITIAL
} from '../fragment/UsersFragment';
import {getFollowedDomain} from '../../../service/domain';
import {getFollowing} from '../../../service/profile';
import {getFollowingTopic} from '../../../service/topics';

const useDiscovery = () => {
  const [, followingDispatch] = React.useContext(Context).following;
  const [refreshing, setRefreshing] = React.useState(false);
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;

  const users = React.useMemo(() => {
    return discovery.initialUsers.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery?.initialUsers]);

  const exhangeFollower = (newUserLists, willFollow, userId, userSection) => {
    const indexUser = newUserLists.findIndex((item) =>
      item.user ? item.user.user_id === userId : item.user_id === userId
    );

    if (indexUser === -1) return newUserLists;

    if (newUserLists?.at(indexUser)?.user) {
      newUserLists[indexUser].user.following = !!willFollow;
      newUserLists[indexUser].user.is_followed = !!willFollow;
    } else {
      newUserLists[indexUser].following = !!willFollow;
      newUserLists[indexUser].is_followed = !!willFollow;
    }

    return newUserLists[indexUser];
  };

  const exchangeFollowerBySection = (newUserLists, willFollow, userId, userSection) => {
    let referenceSectionUsers = [];
    if (userSection === FROM_USERS_INITIAL) referenceSectionUsers = discovery.initialUsers;
    else if (userSection === FROM_FOLLOWED_USERS) referenceSectionUsers = discovery.followedUsers;
    else if (userSection === FROM_UNFOLLOWED_USERS)
      referenceSectionUsers = discovery.unfollowedUsers;

    const indexUserInReferenceSection = referenceSectionUsers.findIndex((item) =>
      item.user ? item.user.user_id === userId : item.user_id === userId
    );

    if (indexUserInReferenceSection === -1) return referenceSectionUsers;

    if (referenceSectionUsers?.at(indexUserInReferenceSection)?.user) {
      referenceSectionUsers[indexUserInReferenceSection].user.following = !!willFollow;
      referenceSectionUsers[indexUserInReferenceSection].user.is_followed = !!willFollow;
    } else {
      referenceSectionUsers[indexUserInReferenceSection].following = !!willFollow;
      referenceSectionUsers[indexUserInReferenceSection].is_followed = !!willFollow;
    }

    if (
      [FROM_FOLLOWED_USERS_INITIAL, FROM_UNFOLLOWED_USERS_INITIAL, FROM_USERS_INITIAL].includes(
        userSection
      )
    ) {
      DiscoveryAction.setDiscoveryInitialUsers(mapUser(referenceSectionUsers), discoveryDispatch);
    } else if (userSection === FROM_FOLLOWED_USERS) {
      DiscoveryAction.setDiscoveryDataUsers({
        followedUsers: mapUser(referenceSectionUsers),
        unfollowedUsers: discovery.unfollowedUsers
      });
    } else if (userSection === FROM_UNFOLLOWED_USERS) {
      DiscoveryAction.setDiscoveryDataUsers({
        unfollowedUsers: mapUser(referenceSectionUsers),
        followedUsers: discovery.followedUsers
      });
    }

    return referenceSectionUsers;
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

  const mapUser = (newUser) => {
    return discovery.initialUsers.map((user) => {
      if (user.user) {
        if (user?.user?.user_id === newUser?.user?.user_id) return newUser;
      } else if (user?.user_id === newUser?.user_id) return newUser;
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

  const updateFollowDiscoveryContext = (willFollow, item, userSection = null) => {
    console.log('updateFollowDiscoveryContext', userSection);
    const newFollowedUsers = [...users];
    const newUser = exhangeFollower(
      newFollowedUsers,
      willFollow,
      item.user ? item.user.user_id : item.user_id,
      userSection
    );

    exchangeFollowerBySection(
      newFollowedUsers,
      willFollow,
      item.user ? item.user.user_id : item.user_id,
      userSection
    );

    DiscoveryAction.setDiscoveryInitialUsers(mapUser(newUser), discoveryDispatch);
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
  return {
    onRefreshDiscovery,
    refreshing,
    updateFollowDiscoveryContext,
    mapUser,
    exhangeFollower,
    users,
    updateFollowTopicDiscoveryContext,
    mapTopic,
    topics,
    topicExchangeFollower
  };
};

export default useDiscovery;
