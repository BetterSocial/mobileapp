/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {useIsFocused} from '@react-navigation/core';

import ChannelList from '../../../database/schema/ChannelListSchema';
import following from '../../../context/actions/following';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ChannelList as ChannelListData} from '../../../../types/database/schema/ChannelList.types';
import {Context} from '../../../context';
import {getFollowing, setFollow, setUnFollow} from '../../../service/profile';

const useFollowUser = () => {
  const isFocused = useIsFocused();
  const {localDb, refresh} = useLocalDatabaseHook();
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

    const isFollowing = followContext?.users?.find(
      (user) => user?.user_id_followed === targetUser?.id
    );
    const payload = {...followContext};

    if (isFollowing) {
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

    if (isFollowing) {
      await setUnFollow(data);
    } else {
      const res = await setFollow(data);
      if (res?.code !== 200) return;

      try {
        const textOwnUser = `You started following ${data.username_followed}.\n Send them a message now.`;
        await ChannelList.updateChannelDescription(localDb, channel?.id, textOwnUser);
        refresh('channelList');
      } catch (error) {
        console.log('error saving data:', error);
      }
    }
  };

  const isInitialFollowing = (channel: ChannelListData) => {
    const targetUser = channel?.rawJson?.members?.find(
      (member) => member?.user_id !== myProfile?.user_id
    )?.user;
    return Boolean(
      initialFollowingDataRef.current?.find((user) => user?.user_id_followed === targetUser?.id)
    );
  };

  const isSystemMessage = (channel: ChannelListData) => {
    return channel?.rawJson?.firstMessage?.type === 'system';
  };

  const isSystemFollowMessage = (channel: ChannelListData) => {
    return isSystemMessage(channel) && channel?.description?.toLowerCase()?.includes('follow');
  };

  return {handleFollow, isInitialFollowing, isSystemMessage, isSystemFollowMessage};
};

export default useFollowUser;
