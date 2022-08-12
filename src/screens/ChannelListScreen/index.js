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
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import CustomPreviewUnreadCount from './elements/CustomPreviewUnreadCount';
import PostNotificationPreview from './elements/components/PostNotificationPreview';
import { getSpecificCache, saveToCache } from '../../utils/cache';
import { CHAT_FOLLOWING_COUNT, FEED_COMMENT_COUNT } from '../../utils/cache/constant';
import PreviewMessage from './elements/CustomPreviewMessage';


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
  const [countComment, setCountComment] = React.useState({})
  // const [countComment, setCountComment] = useRecoilState(commentChatState)
  // const [countChat, setCountChat] = React.useState({})
  const {myProfile} = profileContext
  const [countChat, setCountChat] = React.useState({})

  const [unReadMessage] =
    React.useContext(Context).unReadMessage;
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
      setCountComment(cache)
    } else {
      handleNotHaveCache()
    }
  })
}
const handleNotHaveCache = () => {
  let comment = {}
  listPostNotif.forEach((data) => {
    comment = {...comment, [data.activity_id]: 0}
  })
  saveToCache(FEED_COMMENT_COUNT, comment)
  setCountComment(comment)
}

const handleUpdateCache = (id, totalComment) => {
  const updateReadCache = {...countComment, [id]: totalComment}
  saveToCache(FEED_COMMENT_COUNT, updateReadCache)
  setCountComment(updateReadCache)
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
      refreshCache: () => handleUpdateCache(item.activity_id, item.totalComment),
    })
  }

 

  const countPostNotifComponent = (item) => {
    const readComment = countComment[item.activity_id]
    return (
      <CustomPreviewUnreadCount readComment={readComment} channel={item} />
    )
  }
  
  const chatBadge = (props) => (
    <CustomPreviewUnreadCount   {...props}  />
  )
  const onSelectChat = (channel) => {
     if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
                    // toDo reset main feeds
                    setMainFeeds(null, dispatchFeed)
                    navigation.navigate('TopicPageScreen', { id: channel.data.id });
                  } else {
                    setChannel(channel, dispatch);
                    // ChannelScreen | ChatDetailPage
                    navigation.navigate('ChatDetailPage');
                    
                  }
  }
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
                onSelect={onSelectChat}
                sort={sort}
                options={options}
                maxUnreadCount={99}
                additionalFlatListProps={{
                  onEndReached: () => null,
                  refreshControl: null,
                  // extraData:{countComment},
                }}
               additionalData={listPostNotif}
               context={myContext}
               PreviewUnreadCount={chatBadge}
               PreviewMessage={PreviewMessage}
               PostNotifComponent={({item ,index, refreshList}) => item ? <PostNotificationPreview countPostNotif={countPostNotifComponent} item={item} index={index} onSelectAdditionalData={() => goToFeedDetail(item, refreshList)}  /> : null}
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
