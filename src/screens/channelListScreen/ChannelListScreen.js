import React, {useContext, useMemo, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ChannelList, Chat} from 'stream-chat-react-native';
import {API_URL, API_TOKEN} from '@env';

import {StreamChat} from 'stream-chat';

const chatClient = StreamChat.getInstance('q95x9hkbyd6p');

const filters = {
  example: 'example-apps',
  members: {$in: ['ron']},
  type: 'messaging',
};

const sort = {last_message_at: -1};

const AppContext = React.createContext();

const ChannelListScreen = ({navigation}) => {
  // const {setChannel} = useContext(AppContext);

  const memoizedFilters = useMemo(() => filters, []);

  useEffect(() => {
    const testEnv = () => {
      console.log(API_TOKEN);
    };
    testEnv();
  }, []);

  return (
    <Chat client={chatClient}>
      <View style={StyleSheet.absoluteFill}>
        <ChannelList
          filters={memoizedFilters}
          onSelect={(channel) => {
            navigation.navigate('Channel', {channel: channel});
          }}
          sort={sort}
        />
      </View>
    </Chat>
  );
};

export default ChannelListScreen;
