// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {FlatList, View} from 'react-native';

import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../components/AnonymousChat/PostNotificationChannelItem';
import useSignedChannelListScreenHook from '../../hooks/screen/useSignedChannelListHook';

const ChannelListScreen = () => {
  const {channels, goToChatScreen, goToPostDetailScreen} = useSignedChannelListScreenHook();

  return (
    <FlatList
      data={channels}
      keyExtractor={(item) => item.id}
      renderItem={({item}) => {
        if (item?.channelType === 'PM') {
          return <MessageChannelItem item={item} onChannelPressed={() => goToChatScreen(item)} />;
        }

        if (item?.channelType === 'POST_NOTIFICATION') {
          return (
            <PostNotificationChannelItem
              item={item}
              onChannelPressed={() => goToPostDetailScreen(item)}
            />
          );
        }

        //! TODO:
        //! ADD CONDITIONAL STATEMENT
        // if (item?.channelType === 'TOPIC') {}
        // if (item?.channelType === 'GROUP') {}

        return <View />;
      }}
    />
  );
};

export default ChannelListScreen;
