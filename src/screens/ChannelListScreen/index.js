import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment'
import { ActivityIndicator, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import {
  ChannelList,
  ChannelPreviewMessage,
  ChannelPreviewMessenger,
  ChannelPreviewStatus,
  ChannelPreviewTitle,
  Chat,
  DeepPartial,
  OverlayProvider,
  Streami18n,
  Theme
} from 'stream-chat-react-native';

import ChannelStatusIcon from '../../components/ChannelStatusIcon';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';
import FeedNotification from './elements/FeedNotification';
import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import Loading from '../Loading';
import Search from './elements/Search';
import {
  CHANNEL_TYPE_GROUP_LOCATION,
  CHANNEL_TYPE_TOPIC,
} from '../../utils/constants';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { calculateTime } from '../../utils/time';
import { getChatName } from '../../utils/string/StringUtils';
import { getUserId } from '../../utils/users';
import { setChannel } from '../../context/actions/setChannel';
import { setMainFeeds } from '../../context/actions/feeds';
import { unReadMessageState } from '../../context/reducers/unReadMessageReducer';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';

const theme = {
  messageSimple: {
    file: {
      container: {
        backgroundColor: 'red',
      },
    },
  },
};

const ChannelListScreen = ({ navigation }) => {
  const streami18n = new Streami18n({
    language: 'en',
  });

  const [userId, setUserId] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const [, dispatchFeed] = React.useContext(Context).feeds;
  const [profile] = React.useContext(Context).profile;
  const [unReadMessage, dispatchUnReadMessage] =
    React.useContext(Context).unReadMessage;
  let connect = useClientGetstream();
  const filters = {
    members: { $in: [userId] },
    type: 'messaging',
  };

  React.useEffect(() => { }, [unReadMessage]);

  const sort = [{ last_message_at: -1 }, { cid: -1 }];
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
      setUserId(id);
    } catch (err) {
      crashlytics().recordError(err);
    }
  };

  const customPreviewTitle = (props) => {
    let { name } = props.channel?.data;

    return (
      <View style={{ paddingRight: 12 }}>
        <ChannelPreviewTitle
          displayName={getChatName(name, profile.myProfile.username)}
        />
      </View>
    );
  };

  const CustomPreviewMessage = (props) => {
    return (
      <ChannelPreviewMessage
        latestMessagePreview={{ ...props.latestMessagePreview }}
      />
    );
  };
  

  return (
    <SafeAreaView style={{ height: '100%' }}>
      <StatusBar backgroundColor="transparent" />
      <ScrollView >
        <View style={{ height: 52 }}>
          <Search
            animatedValue={0}
            onPress={() => navigation.navigate('ContactScreen')}
          />
        </View>
        <View style={{ paddingHorizontal: 0, flex: 1 }}>
          {client.client ? (
            <Chat client={client.client} i18nInstance={streami18n}>
              <ChannelList
                PreviewAvatar={CustomPreviewAvatar}
                filters={memoizedFilters}
                // Preview={CustomPreview}
                PreviewStatus={ChannelStatusIcon}
                PreviewTitle={customPreviewTitle}
                onSelect={(channel) => {
                  if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
                    // toDo reset main feeds
                    setMainFeeds(null, dispatchFeed)
                    console.log('channel.data.id')
                    console.log(channel.data.id)
                    navigation.navigate('TopicPageScreen', { id: channel.data.id });
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
                }}
              />
      
            </Chat>
          ) : (
            <View style={styles.content}>
              <ActivityIndicator size="small" color={COLORS.holyTosca} />
            </View>
          )}

   
        </View>
        <FeedNotification navigation={navigation} userid={userId} />

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent',
  },
})

export default ChannelListScreen;
