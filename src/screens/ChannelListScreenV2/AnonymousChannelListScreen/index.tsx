// eslint-disable-next-line no-use-before-define
import {useNavigation} from '@react-navigation/core';
import * as React from 'react';
import {FlatList, StatusBar, View} from 'react-native';

import {useScrollToTop} from '@react-navigation/native';
import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import MessageChannelItem from '../../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../../components/AnonymousChat/PostNotificationChannelItem';
import ChannelListHeaderItem from '../../../components/ChatList/ChannelListHeaderItem';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import {ANONYMOUS, ANON_PM, ANON_POST_NOTIFICATION} from '../../../hooks/core/constant';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';
import useRootChannelListHook from '../../../hooks/screen/useRootChannelListHook';
import Search from '../../ChannelListScreen/elements/Search';
import {COLORS} from '../../../utils/theme';
import IncognitoEmptyChat from '../IncognitoEmptyChat';
import CommunityChannelItem from '../../../components/ChatList/CommunityChannelItem';
import useSignedChannelListScreenHook from '../../../hooks/screen/useSignedChannelListHook';

const AnonymousChannelListScreen = ({route}) => {
  const {refresh} = useLocalDatabaseHook();
  const {checkNotificationPermission} = useRootChannelListHook();
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const {
    channels: anonChannels,
    goToChatScreen,
    goToPostDetailScreen,
    goToContactScreen,
    goToCommunityScreen
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
      return <MessageChannelItem item={item} onChannelPressed={() => goToChatScreen(item)} />;
    }

    if (item?.channelType === ANON_POST_NOTIFICATION) {
      return (
        <PostNotificationChannelItem
          item={item}
          onChannelPressed={() => goToPostDetailScreen(item)}
        />
      );
    }

    if (item?.channelType === 'ANON_TOPIC') {
      // TODO: ADD the correct ANON_TOPIC Channel Item Component here;

      // return <MessageChannelItem item={item} onChannelPressed={() => goToChatScreen(item)} />;
      return (
        <CommunityChannelItem
          channel={item}
          onChannelPressed={() => goToCommunityScreen(item)}
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
        <Search route={route} isAnon={true} onPress={() => goToContactScreen({from: ANONYMOUS})} />
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
