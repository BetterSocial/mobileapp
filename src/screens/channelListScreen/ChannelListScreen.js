import React, {useContext, useMemo, useState, useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {ChannelList, Chat} from 'stream-chat-react-native';
import {STREAM_API_KEY} from '@env';
import JWTDecode from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

import {StreamChat} from 'stream-chat';
import analytics from '@react-native-firebase/analytics';

const chatClient = new StreamChat(STREAM_API_KEY);

const sort = {last_message_at: -1};

const AppContext = React.createContext();

const ChannelListScreen = ({navigation}) => {
  const [userId, setUserId] = useState('');
  const filters = {
    example: 'example-apps',
    members: {$in: [userId]},
    type: 'messaging',
  };
  const memoizedFilters = useMemo(() => filters, []);

  useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChannelListScreen',
      screen_name: 'Channel List',
    });
    setupClient();
  }, []);
    const setupClient = async () => {
      try {
        const value = await AsyncStorage.getItem('tkn-getstream');
        const decoded = await JWTDecode(value);
        let userId = decoded.user_id;
        console.log(userId);
        let user = {
          id: userId,
        };
        setUserId(userId);
        await chatClient.connectUser(user, value);
      } catch (err) {
        console.log(err);
      }
    };
      const testEnv = () => {
      console.log(API_TOKEN);
      }

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
