/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ScrollView, View} from 'react-native';

import AnonPostNotificationChannelItem from '../../../components/AnonymousChat/AnonPostNotificationChannelItem';
import MessageChannelItem from '../../../components/AnonymousChat/MessageChannelItem';
import useAnonymousChannelListScreenHook from '../../../hooks/screen/useAnonymousChannelListHook';

const AnonymousChannelListScreen = () => {
  const {channels, goToChatScreen, goToPostDetailScreen} = useAnonymousChannelListScreenHook();
  return (
    <ScrollView>
      <View>
        {channels?.map((item) => {
          return (
            <>
              {item?.channelType === 'ANON_PM' && (
                <MessageChannelItem item={item} onChannelPressed={() => goToChatScreen(item)} />
              )}
              {item?.channelType === 'ANON_POST_NOTIFICATION' && (
                <AnonPostNotificationChannelItem
                  item={item}
                  onChannelPressed={() => goToPostDetailScreen(item)}
                />
              )}
            </>
          );
        })}
      </View>
    </ScrollView>
  );
};

export default AnonymousChannelListScreen;
