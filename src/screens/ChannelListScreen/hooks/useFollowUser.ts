/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import {useIsFocused} from '@react-navigation/core';
import {v4 as uuid} from 'uuid';

import ChannelList from '../../../database/schema/ChannelListSchema';
import ChatSchema from '../../../database/schema/ChatSchema';
import following from '../../../context/actions/following';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ChannelList as ChannelListData} from '../../../../types/database/schema/ChannelList.types';
import {Context} from '../../../context';
import {followUser, getFollowing, setUnFollow} from '../../../service/profile';
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

    try {
      await followUser(data);
    } catch (error) {
      console.log('error follow user:', error);
    }

    try {
      const randomId = uuid();
      const chatSchema = await ChatSchema.generateSendingChat(
        randomId,
        myProfile?.user_id,
        channelId,
        textOwnUser,
        localDb,
        'system',
        'sent'
      );

      const selectedChannel = (await ChannelList.getById(localDb, channelId)) as any;
      selectedChannel.description = textOwnUser;
      selectedChannel.createdAt = new Date().toISOString();
      selectedChannel.lastUpdatedAt = new Date().toISOString();
      const channelListSchema = ChannelList.fromDatabaseObject(selectedChannel);

      await chatSchema.save(localDb);
      await channelListSchema.save(localDb);
      refresh('chat');
      refresh('channelList');
    } catch (error) {
      console.log('error saving data:', error);
    }
  };

  const handleFollow = async (channel: ChannelListData) => {
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
