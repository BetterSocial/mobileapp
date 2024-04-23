import React from 'react';
import {getFollowing} from '../../../service/profile';
import {getFollowedDomain} from '../../../service/domain';
import {getFollowingTopic} from '../../../service/topics';
import following from '../../../context/actions/following';
import {Context} from '../../../context';
import DiscoveryAction from '../../../context/actions/discoveryAction';

const useDiscovery = () => {
  const [, followingDispatch] = React.useContext(Context).following;
  const [refreshing, setRefreshing] = React.useState(false);
  const [discovery, discoveryDispatch] = React.useContext(Context).discovery;

  const users = React.useMemo(() => {
    return discovery.initialUsers.map((item) => ({
      ...item,
      following: item.following !== undefined ? item.following : item.user_id_follower !== null
    }));
  }, [discovery]);

  const exhangeFollower = (newUserLists, willFollow, userId) => {
    const indexUser = newUserLists.findIndex((item) =>
      item.user ? item.user.user_id === userId : item.user_id === userId
    );
    if (newUserLists[indexUser].user) {
      newUserLists[indexUser].user.following = !!willFollow;
      // newUserLists[indexUser].user.user_id_follower = myId;
    } else {
      newUserLists[indexUser].following = !!willFollow;
      // newUserLists[indexUser].user_id_follower = myId;
    }
    return newUserLists[indexUser];
  };

  const mapUser = (newUser) => {
    return discovery.initialUsers.map((user) => {
      if (user.user) {
        if (user.user.user_id === newUser.user.user_id) return newUser;
      } else if (user.user_id === newUser.user_id) return newUser;
      return user;
    });
  };

  const updateFollowDiscoveryContext = (willFollow, item) => {
    const newFollowedUsers = [...users];
    const newUser = exhangeFollower(
      newFollowedUsers,
      willFollow,
      item.user ? item.user.user_id : item.user_id
    );

    DiscoveryAction.setDiscoveryInitialUsers(mapUser(newUser), discoveryDispatch);
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
    users
  };
};

export default useDiscovery;
