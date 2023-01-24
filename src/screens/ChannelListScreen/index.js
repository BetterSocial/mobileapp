import * as React from 'react';
import {ActivityIndicator, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {ChannelList, ChannelPreviewTitle, Chat, Streami18n} from 'stream-chat-react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useRecoilValue} from 'recoil';

import ChannelStatusIcon from '../../components/ChannelStatusIcon';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';
import CustomPreviewUnreadCount from './elements/CustomPreviewUnreadCount';
import PostNotificationPreview from './elements/components/PostNotificationPreview';
import PreviewMessage from './elements/CustomPreviewMessage';
import Search from './elements/Search';
import streamFeed from '../../utils/getstream/streamer';
import useChannelList from './hooks/useChannelList';
import {CHANNEL_TYPE_TOPIC} from '../../utils/constants';
import {FEED_COMMENT_COUNT} from '../../utils/cache/constant';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {channelListLocalAtom} from '../../service/channelListLocal';
import {getAccessToken} from '../../utils/token';
import {getChatName} from '../../utils/string/StringUtils';
import {getSpecificCache} from '../../utils/cache';
import {setChannel} from '../../context/actions/setChannel';
import {setTotalUnreadPostNotif} from '../../context/actions/unReadMessageAction';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {traceMetricScreen} from '../../libraries/performance/firebasePerformance';
import {feedChatAtom} from '../../models/feeds/feedsNotification';

const ChannelListScreen = ({navigation}) => {
  const streami18n = new Streami18n({
    language: 'en'
  });
  const listPostNotif = useRecoilValue(feedChatAtom);
  const [client] = React.useContext(Context).client;
  const [, dispatch] = React.useContext(Context).channel;
  const [profile] = React.useContext(Context).profile;
  const myContext = React.useContext(Context);
  const [profileContext] = React.useContext(Context).profile;
  const [countReadComment, setCountReadComment] = React.useState({});
  const {myProfile} = profileContext;
  const {mappingUnreadCountPostNotifHook, handleNotHaveCacheHook, handleUpdateCacheHook} =
    useChannelList();
  const [, dispatchUnreadMessage] = React.useContext(Context).unReadMessage;
  const channelListLocalValue = useRecoilValue(channelListLocalAtom);

  const filters = {
    members: {$in: [myProfile.user_id]},
    type: {$in: ['messaging', 'topics']}
  };
  // React.useEffect(() => { }, [unReadMessage]);
  const perf = React.useRef(null);
  const sort = [{last_message_at: -1}];
  const options = {
    state: true,
    watch: true,
    presence: true
  };
  const memoizedFilters = React.useMemo(() => filters, [myProfile.user_id]);

  React.useEffect(() => {
    traceMetricScreen('loading_channelList', (fnCallback) => {
      perf.current = fnCallback;
    });
  }, []);

  React.useEffect(
    () => () => {
      handleUnsubscribeNotif();
    },
    []
  );

  const handleUnsubscribeNotif = async () => {
    const token = await getAccessToken();
    const clientFeed = streamFeed(token);
    const notif = clientFeed.feed('notification', myProfile.user_id, token.id);
    return () => {
      notif.unsubscribe();
    };
  };

  React.useEffect(() => {
    handleCacheComment();
  }, []);

  const handleCacheComment = () => {
    getSpecificCache(FEED_COMMENT_COUNT, (cache) => {
      if (cache) {
        setCountReadComment(cache);
      } else {
        handleNotHaveCache();
      }
    });
  };
  const handleNotHaveCache = () => {
    const comment = handleNotHaveCacheHook(listPostNotif);
    setCountReadComment(comment);
  };

  const handleUpdateCache = (id, totalComment) => {
    const updateReadCache = handleUpdateCacheHook(countReadComment, id, totalComment);
    setCountReadComment(updateReadCache);
  };

  const mappingUnreadCountPostNotif = () => {
    const totalMessage = mappingUnreadCountPostNotifHook(listPostNotif, countReadComment);
    dispatchUnreadMessage(setTotalUnreadPostNotif(totalMessage));
  };

  const customPreviewTitle = (props) => {
    const {name} = props.channel?.data;
    return (
      <View style={{paddingRight: 12}}>
        <ChannelPreviewTitle displayName={getChatName(name, profile.myProfile.username)} />
      </View>
    );
  };

  const goToFeedDetail = async (item) => {
    navigation.navigate('PostDetailPage', {
      feedId: item.activity_id,
      refreshCache: () => handleUpdateCache(item.activity_id, item.totalCommentBadge)
    });
  };

  const countPostNotifComponent = (item) => {
    const readComment = countReadComment[item.activity_id];
    return <CustomPreviewUnreadCount readComment={readComment} channel={item} />;
  };

  const chatBadge = (props) => <CustomPreviewUnreadCount {...props} />;

  const onSelectChat = (channel, refreshList) => {
    if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
      navigation.navigate('TopicPageScreen', {id: channel.data.id, refreshList});
    } else {
      setChannel(channel, dispatch);
      // ChannelScreen | ChatDetailPage
      navigation.navigate('ChatDetailPage');
    }
  };

  React.useEffect(() => {
    mappingUnreadCountPostNotif();
  }, [listPostNotif, countReadComment]);

  const onChannelVisible = () => {
    if (perf.current) {
      perf.current.stop();
    }
  };

  return (
    <SafeAreaProvider style={{height: '100%'}}>
      <StatusBar translucent={false} />
      <ScrollView contentInsetAdjustmentBehavior="automatic">
        <View style={{height: 52}}>
          <Search animatedValue={0} onPress={() => navigation.navigate('ContactScreen')} />
        </View>
        {myProfile && myProfile.user_id && client.client ? (
          <Chat client={client.client} i18nInstance={streami18n}>
            <ChannelList
              PreviewAvatar={CustomPreviewAvatar}
              filters={memoizedFilters}
              PreviewStatus={ChannelStatusIcon}
              PreviewTitle={customPreviewTitle}
              onSelect={onSelectChat}
              sort={sort}
              options={options}
              onChannelVisible={onChannelVisible}
              maxUnreadCount={99}
              localData={channelListLocalValue}
              additionalFlatListProps={{
                onEndReached: () => null,
                refreshControl: null
              }}
              additionalData={listPostNotif}
              context={myContext}
              PreviewUnreadCount={chatBadge}
              PreviewMessage={PreviewMessage}
              PostNotifComponent={(item, index) => (
                <PostNotificationPreview
                  countPostNotif={countPostNotifComponent}
                  item={item.item}
                  index={index}
                  onSelectAdditionalData={() => goToFeedDetail(item.item)}
                  showBadgePostNotif
                />
              )}
            />
          </Chat>
        ) : (
          <View style={styles.content}>
            <ActivityIndicator size="small" color={COLORS.red} />
          </View>
        )}
      </ScrollView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent'
  }
});

export default React.memo(withInteractionsManaged(ChannelListScreen));
