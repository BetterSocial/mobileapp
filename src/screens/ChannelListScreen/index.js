import * as React from 'react';
// eslint-disable-next-line import/no-unresolved
import EasyFollowSystem from 'stream-chat-react-native-core/src/components/ChannelList/EasyFollowSystem';
import Toast from 'react-native-simple-toast';
import crashlytics from '@react-native-firebase/crashlytics';
import moment from 'moment';
import {ActivityIndicator, ScrollView, StatusBar, StyleSheet, View} from 'react-native';
import {ChannelList, ChannelPreviewTitle, Chat, Streami18n} from 'stream-chat-react-native';
import {useNavigation} from '@react-navigation/core';
import {useRecoilState, useRecoilValue} from 'recoil';

import ChannelStatusIcon from '../../components/ChannelStatusIcon';
import CustomPreviewAvatar from './elements/CustomPreviewAvatar';
import CustomPreviewUnreadCount from './elements/CustomPreviewUnreadCount';
import PostNotificationPreview from './elements/components/PostNotificationPreview';
import PreviewMessage from './elements/CustomPreviewMessage';
import api from '../../service/config';
import streamFeed from '../../utils/getstream/streamer';
import useChannelList from './hooks/useChannelList';
import useFeedService from '../../hooks/useFeedService';
import TokenStorage, {ITokenEnum} from '../../utils/storage/custom/tokenStorage';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import {CHANNEL_TYPE_ANONYMOUS, CHANNEL_TYPE_TOPIC} from '../../utils/constants';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {FEED_COMMENT_COUNT} from '../../utils/cache/constant';
import {channelListLocalAtom} from '../../service/channelListLocal';
import {feedChatAtom} from '../../models/feeds/feedsNotification';
import {followersOrFollowingAtom} from './model/followersOrFollowingAtom';
import {getChatName} from '../../utils/string/StringUtils';
import {getSpecificCache} from '../../utils/cache';
import {setChannel} from '../../context/actions/setChannel';
import {setTotalUnreadPostNotif} from '../../context/actions/unReadMessageAction';
import {traceMetricScreen} from '../../libraries/performance/firebasePerformance';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const ChannelListScreen = () => {
  const streami18n = new Streami18n({
    language: 'en'
  });

  const navigation = useNavigation();
  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.SCROLL_VIEW);

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
  const [followUserList, setFollowUserList] = useRecoilState(followersOrFollowingAtom);

  const {getFeedChat} = useFeedService();

  const filters = {
    members: {$in: [myProfile.user_id]},
    type: {$in: ['messaging', 'topics', 'group', 'system']}
  };

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
    const token = TokenStorage.get(ITokenEnum.token);
    const clientFeed = streamFeed(token);
    const notif = clientFeed.feed('notification', myProfile.user_id, token);
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

  /**
   *
   * @param {import('stream-chat-react-native-core').ChannelPreviewTitleProps} props
   * @returns
   */
  const customPreviewTitle = (props) => {
    const {channel} = props;

    const {name} = channel?.data || {};
    const {id} = channel?.data || {};
    let displayName = name || props?.displayName;
    if (channel?.data?.channel_type === CHANNEL_TYPE_ANONYMOUS) {
      displayName = `Anonymous ${channel?.data?.anon_user_info_emoji_name}`;
    }

    if (name?.toLowerCase() === 'us' && id?.toLowerCase() === 'us') displayName = 'United States';

    return (
      <View style={{paddingRight: 12}}>
        <ChannelPreviewTitle displayName={getChatName(displayName, profile.myProfile.username)} />
      </View>
    );
  };

  const goToFeedDetail = async (item) => {
    const currentDate = moment();
    console.log(item.expired_at);
    const expiredDate = moment(item.expired_at);
    const isExpired = expiredDate.isBefore(currentDate);

    if (isExpired) {
      const hoursDiff = currentDate.diff(expiredDate, 'hours');

      if (hoursDiff > 48) {
        Toast.show('This post expired and has been removed', Toast.LONG);
        getFeedChat();
      } else {
        Toast.show('This post expired and has been removed', Toast.LONG);
      }
    } else {
      navigation.navigate('PostDetailPage', {
        feedId: item.activity_id,
        refreshCache: () => handleUpdateCache(item.activity_id, item.totalCommentBadge),
        isCaching: false
      });
    }
  };

  const countPostNotifComponent = (item) => {
    const readComment = countReadComment[item.activity_id];
    return <CustomPreviewUnreadCount readComment={readComment} channel={item} />;
  };

  const chatBadge = (props) => <CustomPreviewUnreadCount {...props} />;

  // eslint-disable-next-line consistent-return
  const onSelectChat = (channel, refreshList) => {
    if (channel.data.channel_type === CHANNEL_TYPE_TOPIC) {
      return navigation.navigate('TopicPageScreen', {id: channel.data.id, refreshList});
    }
    if (channel.data.type_channel === 'system') {
      return Toast.show(channel.state.messages[0]?.text, Toast.LONG);
    }
    setChannel(channel, dispatch);
    // ChannelScreen | ChatDetailPage
    navigation.navigate('ChatDetailPage');
  };

  React.useEffect(() => {
    mappingUnreadCountPostNotif();
  }, [listPostNotif, countReadComment]);

  const onChannelVisible = () => {
    if (perf.current) {
      perf.current.stop();
    }
  };

  const postNotifComponent = (item, index) => (
    <PostNotificationPreview
      countPostNotif={countPostNotifComponent}
      item={item.item}
      index={index}
      onSelectAdditionalData={() => goToFeedDetail(item.item)}
      showBadgePostNotif
    />
  );

  const checkFollowBack = async (data) => {
    try {
      const response = await api.get(`/users/check-follow?targetUserId=${data}`);
      if (response?.data) {
        return response.data.data;
      }

      return null;
    } catch (error) {
      crashlytics().recordError(new Error(error));
      throw new Error(error);
    }
  };

  const followButtonAction = async (userId, targetUserId, username, targetUsername) => {
    const requestData = {
      user_id_follower: userId,
      user_id_followed: targetUserId,
      username_follower: username,
      username_followed: targetUsername,
      follow_source: 'chat'
    };

    api
      .post('/profiles/follow-user-v3', requestData)
      .then((res) => {
        Promise.resolve(res.data);
      })
      .catch((err) => {
        Promise.reject(err);
        setFollowUserList([...followUserList, requestData]);
      });

    return true;
  };
  return (
    <>
      <StatusBar translucent={false} />
      <ScrollView ref={listRef} contentInsetAdjustmentBehavior="automatic">
        <EasyFollowSystem valueCallback={checkFollowBack} followButtonAction={followButtonAction}>
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
                PostNotifComponent={postNotifComponent}
              />
            </Chat>
          ) : (
            <View style={styles.content}>
              <ActivityIndicator size="small" color={COLORS.red} />
            </View>
          )}
        </EasyFollowSystem>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'transparent'
  }
});

export default React.memo(withInteractionsManaged(ChannelListScreen));
