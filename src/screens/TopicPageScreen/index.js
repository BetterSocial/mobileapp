import {useNavigation, useRoute} from '@react-navigation/native';
import _ from 'lodash';
import * as React from 'react';
import {Animated, Platform, StyleSheet, View} from 'react-native';
import SimpleToast from 'react-native-simple-toast';

import {useSafeAreaInsets} from 'react-native-safe-area-context';
import BlockComponent from '../../components/BlockComponent';
import ButtonAddPostTopic from '../../components/Button/ButtonAddPostTopic';
import TiktokScroll from '../../components/TiktokScroll';
import {Context} from '../../context';
import {setFeedByIndex, setTopicFeedByIndex, setTopicFeeds} from '../../context/actions/feeds';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import {getFeedDetail} from '../../service/post';
import {getTopicPages} from '../../service/topicPages';
import {getTopics, getUserTopic} from '../../service/topics';
import {downVote, upVote} from '../../service/vote';
import dimen from '../../utils/dimen';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';
import {COLORS} from '../../utils/theme';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import ShareUtils from '../../utils/share';
import TopicPageStorage from '../../utils/storage/custom/topicPageStorage';
import removePrefixTopic from '../../utils/topics/removePrefixTopic';
import {getUserId} from '../../utils/users';
import useCoreFeed from '../FeedScreen/hooks/useCoreFeed';
import useFeedPreloadHook from '../FeedScreen/hooks/useFeedPreloadHook';
import useViewPostTimeHook from '../FeedScreen/hooks/useViewPostTimeHook';
import MemoizedListComponent from './MemoizedListComponent';
import NavHeader from './elements/NavHeader';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1
  },
  header: {
    backgroundColor: COLORS.signed_primary,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 40,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold'
  }
});

const TopicPageScreen = (props) => {
  const route = useRoute();
  const {params} = route;
  const navigation = useNavigation();
  const [topicName, setTopicName] = React.useState(route?.params?.id);
  const [loading, setLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [userId, setUserId] = React.useState('');
  const [topicId, setTopicId] = React.useState('');
  const [isFollow, setIsFollow] = React.useState(params.isFollowing);
  const [topicDetail, setTopicDetail] = React.useState({});
  const [memberCount, setMemberCount] = React.useState(params.memberCount);
  const [isHeaderHide, setIsHeaderHide] = React.useState(false);
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const feeds = feedsContext.topicFeeds
    ? feedsContext.topicFeeds.filter((feed) => feed?.topics?.includes(topicName))
    : [];
  const mainFeeds = feedsContext.feeds;
  const {timer, viewPostTimeIndex} = feedsContext;

  const [offset, setOffset] = React.useState(0);
  const [client] = React.useContext(Context).client;
  const refBlockComponent = React.useRef();
  const scrollY = React.useRef(new Animated.Value(0)).current;
  const {mappingColorFeed} = useCoreFeed();

  const {onWillSendViewPostTime} = useViewPostTimeHook(dispatch, timer, viewPostTimeIndex);
  const {fetchNextFeeds} = useFeedPreloadHook(feeds?.length, () => refreshingData(offset));

  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.TIKTOK_SCROLL, onRefresh);

  const topicWithPrefix = route.params.id;
  const id = removePrefixTopic(topicWithPrefix);

  const coverPath = topicDetail?.cover_path || null;
  const {top} = useSafeAreaInsets();
  const topPosition = Platform.OS === 'ios' ? top : 0;

  const navigationHeight = coverPath
    ? dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT_COVER
    : dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT;
  const headerShowHeight =
    navigationHeight + dimen.size.TOPIC_FEED_HEADER_HEIGHT + topPosition + normalize(4);
  const headerHideHeight = dimen.size.TOPIC_FEED_NAVIGATION_HEIGHT2;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, headerHideHeight],
    outputRange: [headerShowHeight, headerHideHeight],
    extrapolate: 'clamp'
  });

  const opacityHeader = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  const opacityImage = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  React.useEffect(() => {
    const listener = scrollY.addListener(({value}) => {
      if (value >= 0 && value <= headerHideHeight) {
        setIsHeaderHide(false);
      } else if (value >= headerHideHeight) {
        setIsHeaderHide(true);
      }
    });

    return () => {
      scrollY.removeListener(listener);
    };
  }, [scrollY]);

  const handleScroll = Animated.event([{nativeEvent: {contentOffset: {y: scrollY}}}], {
    useNativeDriver: false
  });

  const initialFetchTopicFeeds = async (cacheLength = 0) => {
    try {
      const resultGetTopicPages = await getTopicPages(id?.toLowerCase(), 0);
      const {data: cacheFeedTopic} = TopicPageStorage.get(id?.toLowerCase());
      const {mapNewData} = mappingColorFeed({
        dataFeed: resultGetTopicPages?.data,
        dataCache: cacheFeedTopic
      });
      const {data = [], offset: offsetFeeds = 0} = resultGetTopicPages || {};
      setTopicFeeds(mapNewData, dispatch);
      setOffset(offsetFeeds);
      TopicPageStorage.set(id?.toLowerCase(), mapNewData, offsetFeeds);

      if (cacheLength === 0 && data?.length === 0)
        SimpleToast.show('No posts yet', SimpleToast.SHORT);
    } catch (e) {
      if (cacheLength === 0 && e?.response?.data?.data?.length === 0) {
        SimpleToast.show('No posts yet', SimpleToast.SHORT);
        setTopicFeeds([], dispatch);
        return;
      }

      if (e?.response?.data?.data?.length === 0) {
        SimpleToast.show('No more posts to show', SimpleToast.SHORT);
      }
    } finally {
      setLoading(false);
    }
  };

  const getTopicDetail = async (domain) => {
    try {
      const query = `?name=${domain}`;
      const resultGetUserTopic = await getUserTopic(query);

      if (resultGetUserTopic.data) {
        setIsFollow(true);
      } else {
        setIsFollow(false);
      }
      const resultTopicDetail = await getTopics(domain);
      if (resultTopicDetail.data) {
        const detail = resultTopicDetail.data[0];
        setTopicDetail(detail);
        setMemberCount(Number(detail.followersCount));
        setIsInitialLoading(false);
      }
    } catch (error) {
      SimpleToast.show(
        'There has been a problem. Please make sure you’re online. ',
        SimpleToast.SHORT
      );
      if (__DEV__) {
        console.log(error);
      }
    } finally {
      setIsInitialLoading(false);
    }
  };

  const initData = async () => {
    try {
      setIsInitialLoading(true);

      const idLower = id.toLowerCase();
      setTopicName(idLower);
      setTopicId(idLower);

      const {feeds: topicFeeds, offset: offsetFeeds} = TopicPageStorage.get(idLower);
      if (topicFeeds?.length > 0) {
        setTopicFeeds(topicFeeds, dispatch);
        setOffset(offsetFeeds);
      } else {
        initialFetchTopicFeeds(topicFeeds?.length);
      }
      getTopicDetail(idLower);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
    }
  };

  React.useEffect(() => {
    const parseToken = async () => {
      const idUser = await getUserId();
      if (idUser) {
        setUserId(idUser);
      }
    };

    parseToken();
    initData();
    updateCount();
  }, []);

  const markRead = async () => {
    const filter = {type: 'topics', members: {$in: [userId]}, id: route.params.id};
    const sort = [{last_message_at: -1}];
    const thisChannel = await client.client.queryChannels(filter, sort);
    const countRead = await thisChannel[0]?.markRead();
    return countRead;
  };

  React.useEffect(() => {
    if (userId !== '') {
      markRead();
    }
  }, [userId]);

  const updateCount = () => {
    if (params.refreshList && typeof params.refreshList === 'function') {
      params.refreshList();
    }
  };

  const refreshingData = async (offsetParam = offset) => {
    if (offsetParam >= 0) {
      try {
        const result = await getTopicPages(topicId, offsetParam);
        const {feeds: cacheFeedTopic} = TopicPageStorage.get(id?.toLowerCase());

        const {data, offset: offsetFeeds} = result;
        const {mapNewData} = mappingColorFeed({dataFeed: data, dataCache: cacheFeedTopic});
        if (result.code === 200) {
          if (offsetParam === 0) {
            TopicPageStorage.set(id?.toLowerCase(), mapNewData, offsetFeeds);
            setTopicFeeds(mapNewData, dispatch);
          } else {
            const joinData = _.uniqBy([...feeds, ...mapNewData], (item) => item.id);
            TopicPageStorage.set(id?.toLowerCase(), joinData, offsetFeeds);
            setTopicFeeds(joinData, dispatch);
          }

          setOffset(offsetFeeds);
        }
      } catch (error) {
        if (__DEV__) {
          console.log(error);
        }
      }

      setLoading(false);
    }
  };
  const onDeleteBlockedPostCompleted = async (postId) => {
    const postIndex = feeds.findIndex((item) => item.id === postId);
    const clonedFeeds = [...feeds];
    clonedFeeds.splice(postIndex, 1);
    setTopicFeeds(clonedFeeds, dispatch);
  };

  const onBlockCompleted = async (postId) => {
    onDeleteBlockedPostCompleted(postId);

    await refreshingData(0);
  };

  const onNewPollFetched = (newPolls, index) => {
    setTopicFeedByIndex(
      {
        index,
        singleFeed: newPolls
      },
      dispatch
    );
  };

  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id
    );
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    refreshingData(offset);
  };

  const onPress = (item, haveSeeMore) => {
    props.navigation.navigate('PostDetailPage', {
      feedId: item.id,
      isalreadypolling: item.isalreadypolling,
      from: 'topic',
      haveSeeMore,
      data: item
    });
  };

  const onPressBlock = (value) => {
    refBlockComponent.current.openBlockComponent(value);
  };

  const onRefresh = () => {
    refreshingData(0);
  };

  const setUpVote = async (post, index) => {
    const processVote = await upVote(post);
    updateFeed(post, index);
    return processVote;
  };
  const setDownVote = async (post, index) => {
    const processVote = await downVote(post);
    updateFeed(post, index);
    return processVote;
  };

  const onShareCommunity = () => {
    ShareUtils.shareCommunity(topicName);
  };

  const updateFeed = async (post, index) => {
    try {
      const data = await getFeedDetail(post.activity_id);
      if (data) {
        const feedIndex = mainFeeds.findIndex((feed) => feed.id === post.activity_id);
        setTopicFeedByIndex(
          {
            singleFeed: data.data,
            index
          },
          dispatch
        );
        setFeedByIndex(
          {
            singleFeed: data.data,
            index: feedIndex
          },
          dispatch
        );
      }
    } catch (e) {
      if (__DEV__) {
        console.log(e);
      }
    }
  };

  const handleOnMemberPress = () => {
    const navigationParam = {
      topicName,
      isFollow,
      topicDetail,
      memberCount,
      getTopicDetail
    };

    navigation.push('TopicMemberScreen', navigationParam);
  };

  const renderItem = ({item, index}) => (
    <MemoizedListComponent
      item={item}
      onNewPollFetched={onNewPollFetched}
      index={index}
      onPressDomain={onPressDomain}
      onPress={(haveSeeMore) => onPress(item, haveSeeMore)}
      onPressComment={() => onPress(item)}
      onPressBlock={() => onPressBlock(item)}
      onPressUpvote={(post) => setUpVote(post, index)}
      userId={userId}
      onPressDownVote={(post) => setDownVote(post, index)}
      loading={loading}
      selfUserId={userId}
    />
  );

  return (
    <>
      <NavHeader
        initialData={{
          channelPicutre: params.channelPicture,
          coverImage: params.coverImage,
          isFollowing: params.isFollowing,
          memberCount: params.memberCount
        }}
        isLoading={isInitialLoading}
        opacityImage={opacityImage}
        domain={topicName}
        animatedHeight={headerHeight}
        onShareCommunity={onShareCommunity}
        isHeaderHide={isHeaderHide}
        opacityHeaderAnimation={opacityHeader}
        handleOnMemberPress={handleOnMemberPress}
        topicDetail={topicDetail}
        memberCount={memberCount}
        setMemberCount={setMemberCount}
        setIsFollow={setIsFollow}
        isFollow={isFollow}
        getTopicDetail={getTopicDetail}
      />
      <View
        style={{
          marginTop: isHeaderHide ? -dimen.size.TOPIC_FEED_HEADER_HEIGHT : 0,
          minHeight: 548,
          height: 700
        }}>
        <TiktokScroll
          ref={listRef}
          contentHeight={dimen.size.TOPIC_CURRENT_ITEM_HEIGHT + normalizeFontSizeByWidth(4)}
          data={feeds}
          onEndReach={onEndReach}
          onRefresh={onRefresh}
          refreshing={loading}
          renderItem={renderItem}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          showSearchBar={true}
          snap
          contentInsetAdjustmentBehavior={feeds?.length > 1 ? 'automatic' : 'never'}
        />
      </View>
      <ButtonAddPostTopic topicName={topicName} onRefresh={onRefresh} />
      <BlockComponent
        ref={refBlockComponent}
        refresh={onBlockCompleted}
        refreshAnonymous={onDeleteBlockedPostCompleted}
        screen="topic_screen"
      />
    </>
  );
};
export default TopicPageScreen;
