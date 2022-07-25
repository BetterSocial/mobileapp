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
import { MessageSystem } from 'stream-chat-react-native-core'
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ChannelStatusIcon from '../../components/ChannelStatusIcon';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';
import FeedNotification from './elements/FeedNotification';
import IconChatCheckMark from '../../assets/icon/IconChatCheckMark'
import Loading from '../Loading';
import Search from './elements/Search';
import streamFeed from '../../utils/getstream/streamer'
import {
  CHANNEL_TYPE_GROUP_LOCATION,
  CHANNEL_TYPE_TOPIC,
} from '../../utils/constants';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { calculateTime } from '../../utils/time';
import { getAccessToken } from '../../utils/token'
import { getChatName } from '../../utils/string/StringUtils';
import { getFeedNotification } from '../../service/feeds'
import { getUserId } from '../../utils/users';
import { setChannel } from '../../context/actions/setChannel';
import { setMainFeeds } from '../../context/actions/feeds';
import { unReadMessageState } from '../../context/reducers/unReadMessageReducer';
import { useAfterInteractions } from '../../hooks/useAfterInteractions';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

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
  const [listPostNotif, setListPostNotif] = React.useState([])
  const [userId, setUserId] = React.useState('');
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const [, dispatchFeed] = React.useContext(Context).feeds;
  const [profile] = React.useContext(Context).profile;
  const myContext = React.useContext(Context)
  const {interactionsComplete} = useAfterInteractions()
  const [profileContext] = React.useContext(Context).profile;
  const {myProfile} = profileContext

  const [unReadMessage, dispatchUnReadMessage] =
    React.useContext(Context).unReadMessage;
  const connect = useClientGetstream();
  const filters = {
    members: { $in: [myProfile.user_id] },
    type: 'messaging',
  };
  React.useEffect(() => { }, [unReadMessage]);

  const sort = [{ last_message_at: -1 }];
  const options = {
    state: true,
    watch: true,
    presence: true,
  };

  const memoizedFilters = React.useMemo(() => filters, [myProfile.user_id]);

  // React.useEffect(() => {
  //   setupClient();

  // }, [])

  React.useEffect(() => {
    if(interactionsComplete) {
      analytics().logScreenView({
        screen_class: 'ChannelListScreen',
        screen_name: 'Channel List',
      });
      getPostNotification()
      // connect();
    }

  }, [interactionsComplete]);

  React.useEffect(() => {
    if(interactionsComplete && myProfile) {
      callStreamFeed()

    }
  }, [interactionsComplete, JSON.stringify(myProfile)])
  const callStreamFeed = async () => {
    const token = await getAccessToken()
    const client = streamFeed(token)
    const notif = client.feed('notification', myProfile.user_id, token)
    notif.subscribe((data) => {
        getPostNotification()

    })

}

  // const setupClient = async () => {
  //   try {
  //     const id = await getUserId();
  //     setUserId(id);
  //   } catch (err) {
  //     crashlytics().recordError(err);
  //   }
  // };

  const getPostNotification = async () => {
    const res = await getFeedNotification()
    if(res.success) {
        setListPostNotif(res.data)
    }
} 

  const customPreviewTitle = (props) => {
    const { name } = props.channel?.data;

    return (
      <View style={{ paddingRight: 12 }}>
        <ChannelPreviewTitle
          displayName={getChatName(name, profile.myProfile.username)}
        />
      </View>
    );
  };

  const goToFeedDetail = (item) => {
    navigation.navigate('PostDetailPage', {
      feedId: item.activity_id
  })
  }

  const CustomPreviewMessage = (props) => (
      <ChannelPreviewMessage
        latestMessagePreview={{ ...props.latestMessagePreview }}
      />
    );
  
  return (
    <SafeAreaProvider style={{ height: '100%' }}>
      {/* <StatusBar backgroundColor="transparent" /> */}
      <ScrollView >
        <View style={{ height: 52 }}>
          <Search
            animatedValue={0}
            onPress={() => navigation.navigate('ContactScreen')}
          />
        </View>
          {myProfile && myProfile.user_id && client.client ? (
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
               additionalData={listPostNotif}
               context={myContext}
               onSelectAdditionalData={goToFeedDetail}
               
              />
      
            </Chat>
          ) : (
            <View style={styles.content}>
              <ActivityIndicator size="small" color={COLORS.holyTosca} />
            </View>
          )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent',
  },
})

export default React.memo(withInteractionsManaged (ChannelListScreen))
