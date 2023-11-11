/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import * as React from 'react';
import {FlatList} from 'react-native';

import CommunityChannelItem from '../../components/ChatList/CommunityChannelItem';
import GroupChatChannelItem from '../../components/ChatList/GroupChatChannelItem';
import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../components/AnonymousChat/PostNotificationChannelItem';
import useFollowUser from './hooks/useFollowUser';
import useSignedChannelListScreenHook from '../../hooks/screen/useSignedChannelListHook';

const ChannelListScreen = () => {
  const {channels, goToChatScreen, goToPostDetailScreen, goToCommunityScreen} =
    useSignedChannelListScreenHook();
  const {handleFollow, isInitialFollowing} = useFollowUser();

  return (
    <FlatList
      data={channels}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      listKey={'ChannelList'}
      renderItem={({item}) => {
        if (item?.channelType === 'PM') {
          const isFromAnonymous = item?.rawJson?.channel?.channel_type === 4;
          const hasFollowButton = !isFromAnonymous && !isInitialFollowing(item);

          return (
            <MessageChannelItem
              item={item}
              onChannelPressed={() => goToChatScreen(item)}
              hasFollowButton={hasFollowButton}
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
          return (
            <GroupChatChannelItem channel={item} onChannelPressed={() => goToChatScreen(item)} />
          );
        }

        if (item?.channelType === 'TOPIC') {
          return (
            <CommunityChannelItem
              channel={item}
              onChannelPressed={() => goToCommunityScreen(item)}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default ChannelListScreen;
