import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {ChannelList, Chat} from 'stream-chat-react-native';
import {STREAM_API_KEY} from '@env';
import JWTDecode from 'jwt-decode';
import analytics from '@react-native-firebase/analytics';
import {StreamChat} from 'stream-chat';
const chatClient = new StreamChat(STREAM_API_KEY);

import {getAccessToken} from '../../data/local/accessToken';
const sort = {last_message_at: -1};

const ChannelListScreen = ({navigation}) => {
  const [userId, setUserId] = React.useState('');
  const filters = {
    example: 'example-apps',
    members: {$in: [userId]},
    type: 'messaging',
  };
  const memoizedFilters = React.useMemo(() => filters, []);

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChannelListScreen',
      screen_name: 'Channel List',
    });
    setupClient();
  }, []);
  const setupClient = async () => {
    try {
      const token = await getAccessToken();
      const id = await JWTDecode(token).user_id;
      let user = {
        id: id,
      };
      setUserId(id);
      await chatClient.connectUser(user, token);
    } catch (err) {
      console.log('Channel list screen');
      console.log(err);
    }
  };

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
