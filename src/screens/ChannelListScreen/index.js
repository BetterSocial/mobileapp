import * as React from 'react';
import {StyleSheet, View} from 'react-native';

import {
  ChannelList,
  Chat,
  Streami18n,
  ChannelAvatar,
} from 'stream-chat-react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import Search from './elements/Search';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {getUserId} from '../../utils/users';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';

const ChannelListScreen = ({navigation}) => {
  const streami18n = new Streami18n({
    language: 'en',
  });

  const [userId, setUserId] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  let connect = useClientGetstream();
  const filters = {
    members: {$in: [userId]},
    type: 'messaging',
  };

  const sort = {last_message_at: -1};
  const options = {};
  const memoizedFilters = React.useMemo(() => filters, [userId]);

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'ChannelListScreen',
      screen_name: 'Channel List',
    });
    connect();
    setupClient();
  }, []);
  const setupClient = async () => {
    try {
      const id = await getUserId();
      console.log('user id ', id);
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
              PreviewAvatar={CustomPreviewAvatar}
              filters={memoizedFilters}
              onSelect={(channel) => {
                setChannel(channel, dispatch);
                // ChannelScreen | ChatDetailPage
                navigation.navigate('ChatDetailPage');
              }}
              sort={sort}
              options={options}
              maxUnreadCount={99}
            />
          </View>
        </Chat>
      )}
    </View>
  );
};

export default ChannelListScreen;
