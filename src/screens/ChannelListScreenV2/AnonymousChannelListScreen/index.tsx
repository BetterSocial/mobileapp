import * as React from 'react';
import {FlatList, StatusBar, View} from 'react-native';
// eslint-disable-next-line no-use-before-define
import {useNavigation} from '@react-navigation/core';
import {useScrollToTop} from '@react-navigation/native';

import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import ChannelListHeaderItem from '../../../components/ChatList/ChannelListHeaderItem';
import CommunityChannelItem from '../../../components/ChatList/CommunityChannelItem';
import IncognitoEmptyChat from '../IncognitoEmptyChat';
import MessageChannelItem from '../../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../../components/AnonymousChat/PostNotificationChannelItem';
import Search from '../../ChannelListScreen/elements/Search';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useRootChannelListHook from '../../../hooks/screen/useRootChannelListHook';
import useSignedChannelListScreenHook from '../../../hooks/screen/useSignedChannelListHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../../libraries/analytics/analyticsEventTracking';
import {ANONYMOUS, ANON_PM, ANON_POST_NOTIFICATION} from '../../../hooks/core/constant';
import {COLORS} from '../../../utils/theme';

const AnonymousChannelListScreen = ({route}) => {
  const {refresh} = useLocalDatabaseHook();
  const {checkNotificationPermission} = useRootChannelListHook();
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const {
    channels: anonChannels,
    goToChatScreen,
    goToPostDetailScreen,
    goToCommunityScreen,
    goToContactScreen
  } = useAnonymousChannelListScreenHook();
  const {fetchLatestTopicPost} = useSignedChannelListScreenHook();
  const ref = React.useRef(null);

  useScrollToTop(ref);

  React.useEffect(() => {
    if (isFocused) {
      refresh('channelList');
      checkNotificationPermission();
    }
  }, [isFocused]);

  const renderChannelItem = ({item}) => {
    if (item?.channelType === ANON_PM) {
      return (
        <MessageChannelItem
          item={item}
          onChannelPressed={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_OPEN_CHAT_SCREEN
            );
            goToChatScreen(item);
          }}
        />
      );
    }

    if (item?.channelType === ANON_POST_NOTIFICATION) {
      return (
        <PostNotificationChannelItem
          item={item}
          onChannelPressed={() => {
            const isOwnAnonymousPost = item?.rawJson?.isOwnAnonymousPost;
            AnalyticsEventTracking.eventTrack(
              isOwnAnonymousPost
                ? BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_MY_POST_NOTIF_OPEN_PDP
                : BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_OTHER_POST_NOTIF_OPEN_PDP
            );
            goToPostDetailScreen(item);
          }}
        />
      );
    }

    if (item?.channelType === 'ANON_TOPIC') {
      return (
        <CommunityChannelItem
          channel={item}
          onChannelPressed={() => {
            AnalyticsEventTracking.eventTrack(
              BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_COMMUNITY_PAGE_OPEN_PAGE
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
          isAnon={true}
          onPress={() => goToContactScreen({from: ANONYMOUS})}
          eventPressName={BetterSocialEventTracking.ANONYMOUS_CHAT_TAB_OPEN_NEW_CHAT}
        />
      </View>

      <IncognitoEmptyChat />

      <FlatList
        ref={ref}
        data={anonChannels}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ChannelListHeaderItem
            name="Incognito"
            picture={AnonymousProfile}
            type="ANONYMOUS"
            testID="horizontal-tab-1"
          />
        }
        renderItem={renderChannelItem}
        style={{backgroundColor: COLORS.almostBlack}}
      />
    </>
  );
};

export default AnonymousChannelListScreen;
