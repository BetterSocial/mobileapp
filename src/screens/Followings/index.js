import * as React from 'react';
import {useNavigation} from '@react-navigation/core';
import {useRoute} from '@react-navigation/native';

import {getFollowing} from '../../service/profile';
import UsersFragment from '../DiscoveryScreenV2/fragment/UsersFragment';

const Followings = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [user_id, setUserId] = React.useState(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [dataFollowing, setDataFollowing] = React.useState([]);

  const {params: rawParams} = route;

  const params = rawParams.params ? rawParams.params : rawParams;

  const fetchFollowing = async (withLoading) => {
    if (withLoading) setIsLoading(true);
    const result = await getFollowing();
    if (result.code === 200) {
      const newData = result.data.map((data) => ({
        ...data,
        name: data.user.username,
        image: data.user.profile_pic_path,
        description: null
      }));
      setDataFollowing(newData);
      if (withLoading) setIsLoading(false);
      navigation.setOptions({
        title: `Users (${newData.length})`
      });
    }
  };
  const fetchFollower = async (withLoading) => {
    if (withLoading) setIsLoading(true);
    // TODO: getfollowers
    const result = await getFollowing();
    if (result.code === 200) {
      const newData = result.data.map((data) => ({
        ...data,
        name: data.user.username,
        image: data.user.profile_pic_path,
        description: null
      }));
      setDataFollowing(newData);
      if (withLoading) setIsLoading(false);
      navigation.setOptions({
        title: `Users (${newData.length})`
      });
    }
  };

  const fetchData = () => {
    if (params.isFollower && user_id) {
      fetchFollower(true);
    } else if (user_id) {
      fetchFollowing(true);
    }
  };

  React.useEffect(() => {
    if (params.user_id) {
      setUserId(params.user_id);
    }
  }, [params.user_id]);

  React.useEffect(() => {
    fetchData();
  }, [user_id, params.isFollower]);

  return (
    <UsersFragment
      followedUsers={dataFollowing}
      setFollowedUsers={setDataFollowing}
      isLoadingDiscoveryUser={isLoading}
      isFirstTimeOpen={dataFollowing.length === 0}
    />
  );
};
export default Followings;
