/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {useIsFocused} from '@react-navigation/core';

import api from '../../../service/config';
import following from '../../../context/actions/following';
import {ChannelList} from '../../../../types/database/schema/ChannelList.types';
import {Context} from '../../../context';
import {getFollowing, setUnFollow} from '../../../service/profile';
import {sendSystemMessage} from '../../../service/chat';

interface FollowUserData {
  user_id_follower: string;
  user_id_followed: string;
  username_follower: string;
  username_followed: string;
  follow_source: string;
}

const useFollowUser = () => {
  const isFocused = useIsFocused();
  const [followContext, followingDispatch] = (React.useContext(Context) as unknown as any)
    .following;
  const [profileContext] = (React.useContext(Context) as unknown as any).profile;
  const {myProfile} = profileContext;

  const [initialFollowingData] = React.useState([...(followContext?.users ?? [])]);

  const updateFollowingData = async () => {
    try {
      await getFollowing().then((response) => {
        following.setFollowingUsers(response.data, followingDispatch);
      });
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

  const setFollow = async (data: FollowUserData, channelId) => {
    const textTargetUser = `${data.username_follower} started following you. Send them a message now`;
    const textOwnUser = `You started following ${data.username_followed}. Send them a message now.`;

    await sendSystemMessage(
      'messaging',
      channelId,
      `${data.username_followed},${data.username_follower}`,
      textTargetUser,
      textOwnUser
    );

    return new Promise((resolve, reject) => {
      api
        .post('/profiles/follow-user-v3', data)
        .then((res) => {
          resolve(res.data);
        })
        .catch((err) => {
          reject(err);
        });
    });
  };

  const handleFollow = async (channel: ChannelList) => {
    const targetUser = channel?.rawJson?.members?.find(
      (member) => member?.user_id !== myProfile?.user_id
    )?.user;

    const data = {
      user_id_follower: myProfile?.user_id,
      user_id_followed: targetUser?.id,
      username_follower: myProfile?.username,
      username_followed: targetUser?.username ?? targetUser?.name,
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
      await setFollow(data, channel?.id);
    }
  };

  const isInitialFollowing = (channel: ChannelList) => {
    const targetUser = channel?.rawJson?.members?.find(
      (member) => member?.user_id !== myProfile?.user_id
    )?.user;
    return Boolean(initialFollowingData?.find((user) => user?.user_id_followed === targetUser?.id));
  };

  const isSystemMessage = (channel: ChannelList) => {
    return channel?.rawJson?.firstMessage?.type === 'system';
  };

  return {handleFollow, isInitialFollowing, isSystemMessage};
};

export default useFollowUser;
