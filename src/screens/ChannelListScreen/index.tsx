/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {FlatList, StatusBar, View} from 'react-native';

import {useScrollToTop} from '@react-navigation/native';
import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../components/AnonymousChat/PostNotificationChannelItem';
import ChannelListHeaderItem from '../../components/ChatList/ChannelListHeaderItem';
import CommunityChannelItem from '../../components/ChatList/CommunityChannelItem';
import GroupChatChannelItem from '../../components/ChatList/GroupChatChannelItem';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import useRootChannelListHook from '../../hooks/screen/useRootChannelListHook';
import useSignedChannelListScreenHook from '../../hooks/screen/useSignedChannelListHook';
import Search from './elements/Search';
import useFollowUser from './hooks/useFollowUser';

const ChannelListScreen = ({route}) => {
  const {refresh} = useLocalDatabaseHook();
  const {checkNotificationPermission} = useRootChannelListHook();
  const {handleFollow, isInitialFollowing} = useFollowUser();
  const {profile} = useUserAuthHook();
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const {channels, goToChatScreen, goToPostDetailScreen, goToCommunityScreen, goToContactScreen} =
    useSignedChannelListScreenHook();
  const ref = React.useRef(null);

  useScrollToTop(ref);

  React.useEffect(() => {
    if (isFocused) {
      refresh('channelList');
      checkNotificationPermission();
    }
  }, [isFocused]);

  const renderChannelItem = ({item}) => {
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
      return <GroupChatChannelItem channel={item} onChannelPressed={() => goToChatScreen(item)} />;
    }

    if (item?.channelType === 'TOPIC') {
      return (
        <CommunityChannelItem channel={item} onChannelPressed={() => goToCommunityScreen(item)} />
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar translucent={false} />
      <View style={{height: 52}}>
        <Search route={route} onPress={goToContactScreen} />
      </View>

      <FlatList
        ref={ref}
        data={channels}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ChannelListHeaderItem
            name={`@${profile?.username}`}
            picture={profile?.profile_pic_path}
            type="SIGNED"
            testID="horizontal-tab-0"
          />
        }
        renderItem={renderChannelItem}
      />
    </>
  );
};

export default ChannelListScreen;
