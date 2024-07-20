import * as React from 'react';
import {FlatList, StatusBar, View} from 'react-native';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-use-before-define */
import {useNavigation} from '@react-navigation/core';
import {useScrollToTop} from '@react-navigation/native';

import ChannelListHeaderItem from '../../components/ChatList/ChannelListHeaderItem';
import CommunityChannelItem from '../../components/ChatList/CommunityChannelItem';
import GroupChatChannelItem from '../../components/ChatList/GroupChatChannelItem';
import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../components/AnonymousChat/PostNotificationChannelItem';
import Search from './elements/Search';
import useChannelGetInitialMessagesHook from '../../hooks/core/chat/useChannelGetInitialMessagesHook';
import useLocalDatabaseHook from '../../database/hooks/useLocalDatabaseHook';
import useRootChannelListHook from '../../hooks/screen/useRootChannelListHook';
import useFetchChannelHook from '../../hooks/core/chat/useFetchChannelHook';
import useSignedChannelListScreenHook from '../../hooks/screen/useSignedChannelListHook';
import useUserAuthHook from '../../hooks/core/auth/useUserAuthHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import {COLORS} from '../../utils/theme';

const ChannelListScreen = ({route}) => {
  const {refresh} = useLocalDatabaseHook();
  const {checkNotificationPermission} = useRootChannelListHook();
  const {profile} = useUserAuthHook();
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const {
    channels,
    fetchLatestTopicPost,
    goToChatScreen,
    goToPostDetailScreen,
    goToCommunityScreen,
    goToContactScreen
  } = useSignedChannelListScreenHook();
  const {getAllSignedChannels} = useFetchChannelHook();
  const {getInitialMessagesFromHashMap, viewabilityConfigCallbackPairs} =
    useChannelGetInitialMessagesHook();

  const ref = React.useRef(null);

  useScrollToTop(ref);

  React.useEffect(() => {
    if (isFocused) {
      getAllSignedChannels();
      refresh('channelList');
      checkNotificationPermission();
    }
  }, [isFocused]);

  const renderChannelItem = ({item}) => {
    if (item?.channelType === 'PM') {
      return (
        <MessageChannelItem
          item={item}
          onChannelPressed={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.SIGNED_CHAT_TAB_OPEN_CHAT_SCREEN
            );
            const initialMessages = getInitialMessagesFromHashMap(item?.id);
            goToChatScreen(item, undefined, {initialMessages});
          }}
        />
      );
    }

    if (item?.channelType === 'POST_NOTIFICATION') {
      return (
        <PostNotificationChannelItem
          item={item}
          onChannelPressed={() => {
            const isOwnSignedPost = item?.rawJson?.isOwnSignedPost;
            AnalyticsEventTracking.eventTrack(
              isOwnSignedPost
                ? BetterSocialEventTracking.SIGNED_CHAT_TAB_MY_POST_NOTIF_OPEN_PDP
                : BetterSocialEventTracking.SIGNED_CHAT_TAB_OTHER_POST_NOTIF_OPEN_PDP
            );
            goToPostDetailScreen(item);
          }}
        />
      );
    }

    if (item?.channelType === 'GROUP') {
      return (
        <GroupChatChannelItem
          channel={item}
          onChannelPressed={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.SIGNED_CHAT_TAB_OPEN_GROUP_CHAT_SCREEN
            );
            const initialMessages = getInitialMessagesFromHashMap(item?.id);
            goToChatScreen(item, undefined, {initialMessages});
          }}
        />
      );
    }

    if (item?.channelType === 'TOPIC') {
      return (
        <CommunityChannelItem
          channel={item}
          onChannelPressed={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.SIGNED_CHAT_TAB_COMMUNITY_PAGE_OPEN_PAGE
            );
            goToCommunityScreen(item);
          }}
          fetchTopicLatestMessage={fetchLatestTopicPost}
        />
      );
    }

    return null;
  };

  return (
    <>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <View style={{height: 52}}>
        <Search
          route={route}
          onPress={() => goToContactScreen({from: 'SIGNED'})}
          eventPressName={BetterSocialEventTracking.SIGNED_CHAT_TAB_OPEN_NEW_CHAT}
        />
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
        style={{backgroundColor: COLORS.almostBlack}}
        viewabilityConfigCallbackPairs={viewabilityConfigCallbackPairs.current}
      />
    </>
  );
};

export default ChannelListScreen;
