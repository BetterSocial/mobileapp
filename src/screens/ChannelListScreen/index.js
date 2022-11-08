import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import { ActivityIndicator, ScrollView, StatusBar, StyleSheet, View } from 'react-native';
import {
  ChannelList,
  ChannelPreviewTitle,
  Chat,
  Streami18n,
} from 'stream-chat-react-native';
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
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import CustomPreviewUnreadCount from './elements/CustomPreviewUnreadCount';
import PostNotificationPreview from './elements/components/PostNotificationPreview';
import { getSpecificCache } from '../../utils/cache';
import { CHAT_FOLLOWING_COUNT, FEED_COMMENT_COUNT } from '../../utils/cache/constant';
import PreviewMessage from './elements/CustomPreviewMessage';
import { setTotalUnreadPostNotif } from '../../context/actions/unReadMessageAction';
import useChannelList from './hooks/useChannelList';
import { useRecoilValue } from 'recoil';
import { channelListLocalAtom } from '../../service/channelListLocal';


const ChannelListScreen = ({ navigation }) => {
  const streami18n = new Streami18n({
    language: 'en',
  });
  const [listPostNotif, setListPostNotif] = React.useState([])
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const [, dispatchFeed] = React.useContext(Context).feeds;
  const [profile] = React.useContext(Context).profile;
  const myContext = React.useContext(Context)
  const {interactionsComplete} = useAfterInteractions()
  const [profileContext] = React.useContext(Context).profile;
  const [countReadComment, setCountReadComment] = React.useState({})
  // const [countChat, setCountChat] = React.useState({})
  const {myProfile} = profileContext
  const [postCount, setPostCount] = React.useState(0)
  const {mappingUnreadCountPostNotifHook, handleNotHaveCacheHook, handleUpdateCacheHook} = useChannelList()
  const [unReadMessage, dispatchUnreadMessage] =
    React.useContext(Context).unReadMessage;
  const channelListLocalValue = useRecoilValue(channelListLocalAtom);

  const filters = {
    members: { $in: [myProfile.user_id] },
    type: {$in: ['messaging', 'topics']},
  };
  // React.useEffect(() => { }, [unReadMessage]);

  const sort = [{ last_message_at: -1 }];
  const options = {
    state: true,
    watch: true,
    presence: true,
  };
  const memoizedFilters = React.useMemo(() => filters, [myProfile.user_id]);

  React.useEffect(() => {
    if(interactionsComplete) {
      analytics().logScreenView({
        screen_class: 'ChannelListScreen',
        screen_name: 'Channel List',
      });
      getPostNotification()
    }

  }, [interactionsComplete]);

  React.useEffect(() => {
    if(myProfile) {
      callStreamFeed()
      handleUnsubscribeNotif()
    }
  }, [JSON.stringify(myProfile)])

  const callStreamFeed = async () => {
    const token = await getAccessToken()
    const client = streamFeed(token)
    const notif = client.feed('notification', myProfile.user_id, token)
    notif.subscribe(() => {
        getPostNotification()

    })

}

const handleUnsubscribeNotif = async () => {
  const token = await getAccessToken()
  const client = streamFeed(token)
  const notif = client.feed('notification', myProfile.user_id, token)
  return () => {
    notif.unsubscribe()
  }
}

React.useEffect(() => {
  handleCacheComment()
}, [])

const handleCacheComment  = () => {
    getSpecificCache(FEED_COMMENT_COUNT, (cache) => {
    if(cache) {
      setCountReadComment(cache)
    } else {
      handleNotHaveCache()
    }
  })
}

const handleNotHaveCache = () => {
  const comment = handleNotHaveCacheHook(listPostNotif)
  setCountReadComment(comment)
}

const handleUpdateCache = (id, totalComment) => {
  const updateReadCache = handleUpdateCacheHook(countReadComment, id, totalComment)
  setCountReadComment(updateReadCache)
}

const mappingUnreadCountPostNotif = () => {
  const totalMessage = mappingUnreadCountPostNotifHook(listPostNotif, countReadComment)
  dispatchUnreadMessage(setTotalUnreadPostNotif(totalMessage))
}

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

  const goToFeedDetail = async (item) => {
    navigation.navigate('PostDetailPage', {
      feedId: item.activity_id,
      refreshCache: () => handleUpdateCache(item.activity_id, item.totalCommentBadge),
    })
  }

  const countPostNotifComponent = (item) => {
    const readComment = countReadComment[item.activity_id]
    return (
      <CustomPreviewUnreadCount readComment={readComment} channel={item} />
    )
  }

  const chatBadge = (props) => (
    <CustomPreviewUnreadCount   {...props}  />
  )

  const onSelectChat = (channel, refreshList) => {
     if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
                    // toDo reset main feeds
                    setMainFeeds(null, dispatchFeed)
                    navigation.navigate('TopicPageScreen', { id: channel.data.id, refreshList });
                  } else {
                    setChannel(channel, dispatch);
                    // ChannelScreen | ChatDetailPage
                    navigation.navigate('ChatDetailPage');

                  }
  }

  React.useEffect(() => {
    mappingUnreadCountPostNotif()
  }, [listPostNotif, countReadComment])

  return (
    <SafeAreaProvider style={{ height: '100%' }}>
      <StatusBar translucent={false} />
      <ScrollView contentInsetAdjustmentBehavior='automatic' >
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
                // List={(props) => console.log(props, 'babah')}
                // Preview={CustomPreview}
                PreviewStatus={ChannelStatusIcon}
                PreviewTitle={customPreviewTitle}
                onSelect={onSelectChat}
                //  channelRenderFilterFn={(channel) => console.log(channel, 'bahan')}
                sort={sort}
                options={options}
                maxUnreadCount={99}
                clientData={channelListLocalValue}
                additionalFlatListProps={{
                  onEndReached: () => null,
                  refreshControl: null,
                  // extraData:{countReadComment},
                }}

               additionalData={listPostNotif}
               context={myContext}
               PreviewUnreadCount={chatBadge}
               PreviewMessage={PreviewMessage}
               postNotifComponent={(item, index, refreshList) => <PostNotificationPreview countPostNotif={countPostNotifComponent} item={item} index={index} onSelectAdditionalData={() => goToFeedDetail(item, refreshList)} showBadgePostNotif  />}
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
