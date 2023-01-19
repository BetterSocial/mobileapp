import React from 'react'
import { getFollowing, setFollow, setUnFollow } from '../../../service/profile';


const useFollowing = ({navigation}) => {
    const [user_id, setUserId] = React.useState(null);
    const [username, setUsername] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    const [dataFollowing, setDataFollowing] = React.useState([]);

    const fetchFollowing = async (withLoading) => {
    if(withLoading) setIsLoading(true)
    // const userId = await getUserId();
    const result = await getFollowing(user_id);
    handleResponseFetchFollowing(result)
  };

  const handleResponseFetchFollowing = (result) => {
     if (result.code === 200) {
        const newData = result.data.map((data) => ({ ...data, name: data.user.username, image: data.user.profile_pic_path, description: null }))
        setDataFollowing(newData);
        navigation.setOptions({
            title: `Users (${newData.length})`,
        });
    }
    setIsLoading(false)
  }

  const handleSetUnFollow = async (index) => {
    const newDataFollowing = [...dataFollowing];
    const singleDataFollowing = newDataFollowing[index];
    newDataFollowing[index].isunfollowed = true;
    setDataFollowing(newDataFollowing);

    const data = {
      user_id_follower: user_id,
      user_id_followed: singleDataFollowing.user.user_id,
      follow_source: 'other-profile',
    };

   await setUnFollow(data);
  };

  const handleSetFollow = async (index) => {
    const newDataFollowing = [...dataFollowing];
    const singleDataFollowing = newDataFollowing[index];
    delete newDataFollowing[index].isunfollowed;
    setDataFollowing(newDataFollowing);

    const data = {
      user_id_follower: user_id,
      user_id_followed: singleDataFollowing.user.user_id,
      username_follower: username,
      username_followed: singleDataFollowing.user.username,
      follow_source: 'other-profile',
    };
    await setFollow(data);
  };

    const goToOtherProfile = (value) => {
    const data = {
      user_id,
      other_id: value.user_id_followed,
      username: value.user.username,
    };

    navigation.navigate('OtherProfile', { data });
  };

  return {
    user_id,
    setUserId,
    username,
    setUsername,
    isLoading,
    setIsLoading,
    dataFollowing,
    setDataFollowing,
    handleSetFollow,
    handleSetUnFollow,
    fetchFollowing,
    handleResponseFetchFollowing,
    goToOtherProfile
  }
    
}


export default useFollowing