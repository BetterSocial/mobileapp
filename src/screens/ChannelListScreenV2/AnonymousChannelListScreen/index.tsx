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
import {ANON_PM, ANON_POST_NOTIFICATION} from '../../../hooks/core/constant';

const AnonymousChannelListScreen = ({route}) => {
  const {refresh} = useLocalDatabaseHook();
  const {checkNotificationPermission} = useRootChannelListHook();
  const navigation = useNavigation();
  const isFocused = navigation.isFocused();
  const {
    channels: anonChannels,
    goToChatScreen,
    goToPostDetailScreen,
    goToContactScreen
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
      // TODO: ADD the correct ANON_TOPIC Channel Item Component here;

      return <MessageChannelItem item={item} onChannelPressed={() => goToChatScreen(item)} />;
    }

    return null;
  };

  return (
    <>
      <StatusBar translucent={false} />
      <View style={{height: 52}}>
        <Search route={route} onPress={goToContactScreen} isShowNewChat={false} />
      </View>

      <FlatList
        data={anonChannels}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <ChannelListHeaderItem
            name="Anonymous"
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
