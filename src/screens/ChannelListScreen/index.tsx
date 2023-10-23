/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from 'react';
import {FlatList} from 'react-native';
import {useIsFocused} from '@react-navigation/core';

import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../components/AnonymousChat/PostNotificationChannelItem';
import api from '../../service/config';
import following from '../../context/actions/following';
import useSignedChannelListScreenHook from '../../hooks/screen/useSignedChannelListHook';
import {Context} from '../../context';
import {getFollowing, setUnFollow} from '../../service/profile';
import {sendSystemMessage} from '../../service/chat';

const ChannelListScreen = () => {
  const {channels, goToChatScreen, goToPostDetailScreen} = useSignedChannelListScreenHook();
  const isFocused = useIsFocused();

  const [followContext, followingDispatch] = (React.useContext(Context) as unknown as any)
    .following;
  const [profileContext] = (React.useContext(Context) as unknown as any).profile;
  const {myProfile} = profileContext;

  React.useEffect(() => {
    updateFollowingData();
  }, [isFocused]);

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

  const setFollow = async (data, channelId) => {
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

  const handleFollow = async (channel) => {
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

  return (
    <FlatList
      data={channels}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      listKey={'ChannelList'}
      renderItem={({item}) => {
        if (item?.channelType === 'PM') {
          return (
            <MessageChannelItem
              item={item}
              onChannelPressed={() => goToChatScreen(item)}
              handleFollow={() => handleFollow(item)}
            />
          );
        }

        if (item?.channelType === 'POST_NOTIFICATION') {
          return (
            <PostNotificationChannelItem
              item={item}
              onChannelPressed={() => goToPostDetailScreen(item)}
            />
          );
        }

        if (item?.channelType === 'GROUP') {
          // group item
        }

        if (item?.channelType === 'TOPIC') {
          // topic item
        }

        return null;
      }}
    />
  );
};

export default ChannelListScreen;
