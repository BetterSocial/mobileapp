import * as React from 'react';
import {StyleSheet, View, SafeAreaView, StatusBar} from 'react-native';

import {
  ChannelList,
  ChannelPreviewStatus,
  ChannelPreviewTitle,
  ChannelPreviewMessenger,
  ChannelPreviewMessage,
  Chat,
  Streami18n,
} from 'stream-chat-react-native';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import Search from './elements/Search';
import {Context} from '../../context';
import {setChannel} from '../../context/actions/setChannel';
import {useClientGetstream} from '../../utils/getstream/ClientGetStram';
import {getUserId} from '../../utils/users';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';
import {getChatName} from '../../utils/string/StringUtils';
import {
  CHANNEL_TYPE_GROUP_LOCATION,
  CHANNEL_TYPE_TOPIC,
} from '../../utils/constants';
import {unReadMessageState} from '../../context/reducers/unReadMessageReducer';

const ChannelListScreen = ({navigation}) => {
  const streami18n = new Streami18n({
    language: 'en',
  });

  const [userId, setUserId] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const [unReadMessage, dispatchUnReadMessage] =
    React.useContext(Context).unReadMessage;
  let connect = useClientGetstream();
  const filters = {
    members: {$in: [userId]},
    type: 'messaging',
  };

  React.useEffect(() => {}, [unReadMessage]);

  const sort = [{last_message_at: -1}, {cid: -1}];
  const options = {
    state: true,
    watch: true,
    presence: true,
  };

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

  const customPreviewStatus = (props) => {
    let newLatestMessagePreview = {...props.latestMessagePreview};
    // console.log(props);
    // if (props.latestMessagePreview.status > 1) {
    //   newLatestMessagePreview.status = 3;
    // }
    return (
      <View style={{paddingRight: 12}}>
        <ChannelPreviewStatus latestMessagePreview={newLatestMessagePreview} />
      </View>
    );
  };

  const customPreviewTitle = (props) => {
    let {name} = props.channel?.data;

    return (
      <View style={{paddingRight: 12}}>
        <ChannelPreviewTitle
          displayName={getChatName(name, profile.username)}
        />
      </View>
    );
  };

  const CustomPreviewMessage = (props) => {
    console.log('props');
    console.log(props);
    return (
      <ChannelPreviewMessage
        latestMessagePreview={{...props.latestMessagePreview}}
      />
    );
  };

  const CustomPreview = (props) => {
    return (
      <View style={{paddingHorizontal: 15}}>
        <ChannelPreviewMessenger
          channel={props.channel}
          PreviewStatus={customPreviewStatus}
          PreviewAvatar={CustomPreviewAvatar}
          PreviewTitle={customPreviewTitle}
          PreviewMessage={CustomPreviewMessage}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={{height: '100%'}}>
      <StatusBar backgroundColor="transparent" />
      {client.client && (
        <Chat client={client.client} i18nInstance={streami18n}>
          <View style={{height: '100%'}}>
            <View style={{height: 52}}>
              <Search
                animatedValue={0}
                onPress={() => navigation.navigate('ContactScreen')}
              />
            </View>
            <View style={{paddingHorizontal: 0, flex: 1}}>
              <ChannelList
                PreviewAvatar={CustomPreviewAvatar}
                filters={memoizedFilters}
                // Preview={CustomPreview}
                PreviewStatus={customPreviewStatus}
                PreviewTitle={customPreviewTitle}
                onSelect={(channel) => {
                  console.log(channel.data);
                  if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
                    navigation.navigate('TopicPageScreen');
                  } else {
                    setChannel(channel, dispatch);
                    // ChannelScreen | ChatDetailPage
                    navigation.navigate('ChatDetailPage');
                  }
                }}
                sort={sort}
                options={options}
                maxUnreadCount={99}
                additionalFlatListProps={{
                  onEndReached: () => null,
                  refreshControl: null,
                  contentContainerStyle: {},
                }}
              />
            </View>
          </View>
        </Chat>
      )}
    </SafeAreaView>
  );
};

export default ChannelListScreen;
