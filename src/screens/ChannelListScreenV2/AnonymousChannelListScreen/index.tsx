// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {FlatList, StatusBar, View} from 'react-native';
import {useNavigation} from '@react-navigation/core';

import AnonymousProfile from '../../../assets/images/AnonymousProfile.png';
import ChannelListHeaderItem from '../../../components/ChatList/ChannelListHeaderItem';
import MessageChannelItem from '../../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../../components/AnonymousChat/PostNotificationChannelItem';
import Search from '../../ChannelListScreen/elements/Search';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';
import useLocalDatabaseHook from '../../../database/hooks/useLocalDatabaseHook';
import useRootChannelListHook from '../../../hooks/screen/useRootChannelListHook';
import {ANONYMOUS, ANON_PM, ANON_POST_NOTIFICATION} from '../../../hooks/core/constant';
import CommunityChannelItem from '../../../components/ChatList/CommunityChannelItem';

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
        <Search route={route} isAnon={true} onPress={() => goToContactScreen({from: ANONYMOUS})} />
      </View>

      <FlatList
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
      />
    </>
  );
};

export default AnonymousChannelListScreen;
