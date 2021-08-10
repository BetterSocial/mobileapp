import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import JWTDecode from 'jwt-decode';
import {ChannelList, Chat, Streami18n} from 'stream-chat-react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import {getAccessToken} from '../../utils/token';
import Search from './elements/Search';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';

const ChannelListScreen = ({navigation}) => {
  const streami18n = new Streami18n({
    language: 'en',
  });

  const [userId, setUserId] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const filters = {
    members: {$in: [userId]},
    type: 'messaging',
  };

  const sort = {last_message_at: -1};
  const options = {
    state: true,
    watch: true,
  };
  const memoizedFilters = React.useMemo(() => filters, [userId]);

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
      setUserId(id);
    } catch (err) {
      crashlytics().recordError(err);
    }
  };

  return (
    <View style={{height: '100%'}}>
      <Search
        animatedValue={0}
        onPress={() => navigation.navigate('ContactScreen')}
      />
      {client.client && (
        <Chat client={client.client} i18nInstance={streami18n}>
          <View style={StyleSheet.absoluteFill}>
            <ChannelList
              filters={memoizedFilters}
              onSelect={(channel) => {
                // console.log(channel);

                navigation.navigate('ChannelScreen');
                setChannel(channel, dispatch);
              }}
              sort={sort}
              options={options}
            />
          </View>
        </Chat>
      )}
    </View>
  );
};

export default ChannelListScreen;
