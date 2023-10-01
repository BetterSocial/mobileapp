// eslint-disable-next-line no-use-before-define
import * as React from 'react';
import {FlatList, View} from 'react-native';

import AnonPostNotificationChannelItem from '../../components/AnonymousChat/AnonPostNotificationChannelItem';
import MessageChannelItem from '../../components/AnonymousChat/MessageChannelItem';
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
            <AnonPostNotificationChannelItem
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
