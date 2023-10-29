/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import * as React from 'react';
import {FlatList} from 'react-native';

import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../components/AnonymousChat/PostNotificationChannelItem';
import useFollowUser from './hooks/useFollowUser';
import useSignedChannelListScreenHook from '../../hooks/screen/useSignedChannelListHook';

const ChannelListScreen = () => {
  const {channels, goToChatScreen, goToPostDetailScreen} = useSignedChannelListScreenHook();
  const {handleFollow, isInitialFollowing, isSystemMessage} = useFollowUser();

  return (
    <FlatList
      data={channels}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      listKey={'ChannelList'}
      renderItem={({item}) => {
        if (item?.channelType === 'PM') {
          const hasFollowButton = isSystemMessage(item) && !isInitialFollowing(item);

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
