/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */

import * as React from 'react';
import {ScrollView, View} from 'react-native';

import MessageChannelItem from '../../../components/AnonymousChat/MessageChannelItem';
import PostNotificationChannelItem from '../../../components/AnonymousChat/PostNotificationChannelItem';
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
                <PostNotificationChannelItem
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
