import React from 'react';
import {getFollowing} from '../../../service/profile';
import {getFollowedDomain} from '../../../service/domain';
import {getFollowingTopic} from '../../../service/topics';
import following from '../../../context/actions/following';
import {Context} from '../../../context';

const useDiscovery = () => {
  const [, followingDispatch] = React.useContext(Context).following;
  const [refreshing, setRefreshing] = React.useState(false);

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
    refreshing
  };
};

export default useDiscovery;
