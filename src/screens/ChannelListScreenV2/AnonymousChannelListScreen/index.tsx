// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {FlatList} from 'react-native';

import MessageChannelItem from '../../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../../components/AnonymousChat/PostNotificationChannelItem';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';

const AnonymousChannelListScreen = () => {
  const {
    channels: anonChannels,
    goToChatScreen,
    goToPostDetailScreen
  } = useAnonymousChannelListScreenHook();

  return (
    <FlatList
      data={anonChannels}
      keyExtractor={(item) => item.id}
      scrollEnabled={false}
      listKey={'AnonymousChannelList'}
      renderItem={({item}) => {
        if (item?.channelType === 'ANON_PM') {
          return <MessageChannelItem item={item} onChannelPressed={() => goToChatScreen(item)} />;
        }

        if (item?.channelType === 'ANON_POST_NOTIFICATION') {
          return (
            <PostNotificationChannelItem
              item={item}
              onChannelPressed={() => goToPostDetailScreen(item)}
            />
          );
        }

        return null;
      }}
    />
  );
};

export default AnonymousChannelListScreen;
