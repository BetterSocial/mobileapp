import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import {
  ChannelList,
  ChannelPreviewTitle,
  Chat,
  Streami18n} from 'stream-chat-react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import ChannelStatusIcon from '../../components/ChannelStatusIcon';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';

import Search from './elements/Search';
import streamFeed from '../../utils/getstream/streamer'
import {
  CHANNEL_TYPE_TOPIC,
} from '../../utils/constants';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { getAccessToken } from '../../utils/token'
import { getChatName } from '../../utils/string/StringUtils';
import { getFeedNotification } from '../../service/feeds'
import { setChannel } from '../../context/actions/setChannel';
import { setMainFeeds } from '../../context/actions/feeds';
import { useAfterInteractions } from '../../hooks/useAfterInteractions';
import { useClientGetstream } from '../../utils/getstream/ClientGetStram';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import CustomPreviewUnreadCount from './elements/CustomPreviewUnreadCount';
import PostNotificationPreview from './elements/components/PostNotificationPreview';

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


  const countPostNotifComponent = (item) => (
    <CustomPreviewUnreadCount channel={item} />
  )
  
  return (
    <SafeAreaProvider style={{ height: '100%' }}>
      <StatusBar translucent={false} />
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
               showBadgePostNotif
               PreviewUnreadCount={CustomPreviewUnreadCount}
               countPostNotif={countPostNotifComponent}
               postNotifComponent={(item, index) => <PostNotificationPreview item={item} index={index} onSelectAdditionalData={goToFeedDetail} showBadgePostNotif  />}
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
