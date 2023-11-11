/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {useCallback} from 'react';
import {useIsFocused} from '@react-navigation/core';

import following from '../../../context/actions/following';
import {ChannelList as ChannelListData} from '../../../../types/database/schema/ChannelList.types';
import {Context} from '../../../context';
import {getFollowing, setFollow, setUnFollow} from '../../../service/profile';

const useFollowUser = () => {
  const isFocused = useIsFocused();
  const [followContext, followingDispatch] = (React.useContext(Context) as unknown as any)
    .following;
  const [profileContext] = (React.useContext(Context) as unknown as any).profile;
  const {myProfile} = profileContext;

  const initialFollowingDataRef = React.useRef([...(followContext?.users ?? [])]);

  const updateFollowingData = async () => {
    try {
      const response = await getFollowing();
      following.setFollowingUsers(response.data, followingDispatch);
    } catch (e) {
      if (__DEV__) {
        console.log('error: ', e);
      }
      throw new Error(e);
    }
  };

  React.useEffect(() => {
    updateFollowingData();
  }, [isFocused]);

  const isFollowing = (channel: ChannelListData): boolean => {
    const targetUser = channel?.rawJson?.channel?.members?.find(
      (member) => member?.user_id !== myProfile?.user_id
    )?.user;
    return Boolean(followContext?.users?.find((user) => user?.user_id_followed === targetUser?.id));
  };

  const handleFollow = async (channel: ChannelListData) => {
    const targetUser = channel?.rawJson?.channel?.members?.find(
      (member) => member?.user_id !== myProfile?.user_id
    )?.user;

    const data = {
      user_id_follower: myProfile?.user_id,
      user_id_followed: targetUser?.id,
      username_follower: myProfile?.username,
      username_followed: targetUser?.username ?? targetUser?.name ?? channel?.name,
      follow_source: 'chat'
    };

    const isFollowingUser = isFollowing(channel);
    const payload = {...followContext};

    if (isFollowingUser) {
      payload?.users?.splice(
        payload?.users?.findIndex((user) => user?.user_id_followed === targetUser?.id),
        1
      );
    } else {
      payload?.users?.push({
        user_id_followed: targetUser?.id,
        user_id_follower: myProfile?.user_id
      });
    }

    following.setFollowingUsers(payload?.users, followingDispatch);

    if (isFollowingUser) {
      await setUnFollow(data);
    } else {
      await setFollow(data);
    }
  };

  const isInitialFollowing = useCallback((channel: ChannelListData) => {
    const targetUser = channel?.rawJson?.members?.find(
      (member) => member?.user_id !== myProfile?.user_id
    )?.user;
    return Boolean(
      initialFollowingDataRef.current?.find((user) => user?.user_id_followed === targetUser?.id)
    );
  }, []);

  const isSystemMessage = (channel: ChannelListData) => {
    return channel?.rawJson?.firstMessage?.type === 'system';
  };

  const isSystemFollowMessage = (channel: ChannelListData) => {
    return isSystemMessage(channel) && channel?.description?.toLowerCase()?.includes('follow');
  };

  return {
    handleFollow,
    isInitialFollowing,
    isFollowing,
    isSystemMessage,
    isSystemFollowMessage
  };
};

export default useFollowUser;
