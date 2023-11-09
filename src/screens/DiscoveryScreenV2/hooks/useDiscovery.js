import React from 'react';
import {getFollowing} from '../../../service/profile';
import {getFollowedDomain} from '../../../service/domain';
import {getFollowingTopic} from '../../../service/topics';
import following from '../../../context/actions/following';
import {Context} from '../../../context';
import DiscoveryRepo from '../../../service/discovery';
import DiscoveryAction from '../../../context/actions/discoveryAction';

const useDiscovery = () => {
  const [, followingDispatch] = React.useContext(Context).following;
  const [refreshing, setRefreshing] = React.useState(false);
  const [discoveryContext, discoveryDispatch] = React.useContext(Context).discovery;
  const users = discoveryContext?.initialUsers;
  const [profile] = React.useContext(Context).profile;

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
        following.setFollowingTopics(response.data, followingDispatch);
      });
      setRefreshing(false);
    } catch (e) {
      setRefreshing(false);
    }
  };

  const onRefreshDiscoveryUser = async () => {
    try {
      const discoveryInitialUserResponse = await DiscoveryRepo.fetchInitialDiscoveryUsers();
      DiscoveryAction.setDiscoveryInitialUsers(
        discoveryInitialUserResponse.suggestedUsers,
        discoveryDispatch
      );
    } catch (e) {
      setRefreshing(false);
    }
  };

  const handleUpdateDiscoveryUser = (id, isFollow) => {
    if (users && Array.isArray(users)) {
      const mapUser = users.map((user) => {
        if (user.user_id === id) {
          return {...user, user_id_follower: isFollow ? profile?.myProfile?.user_id : null};
        }
        return {...user};
      });
      DiscoveryAction.setDiscoveryInitialUsers(mapUser, discoveryDispatch);
    }
  };

  return {
    onRefreshDiscovery,
    refreshing,
    onRefreshDiscoveryUser,
    handleUpdateDiscoveryUser
  };
};

export default useDiscovery;
