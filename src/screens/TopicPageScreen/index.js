import * as React from 'react';
import _ from 'lodash';
import SimpleToast from 'react-native-simple-toast';
import {Animated, InteractionManager, StatusBar, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import BlockComponent from '../../components/BlockComponent';
import ButtonAddPostTopic from '../../components/Button/ButtonAddPostTopic';
import MemoizedListComponent from './MemoizedListComponent';
import Navigation from './elements/Navigation';
import Header from './elements/Header';
import ShareUtils from '../../utils/share';
import TiktokScroll from '../../components/TiktokScroll';
import TopicPageStorage from '../../utils/storage/custom/topicPageStorage';
import dimen from '../../utils/dimen';
import removePrefixTopic from '../../utils/topics/removePrefixTopic';
import useChatClientHook from '../../utils/getstream/useChatClientHook';
import {Context} from '../../context';
import {downVote, upVote} from '../../service/vote';
import {getFeedDetail} from '../../service/post';
import {getTopicPages} from '../../service/topicPages';
import {getUserId} from '../../utils/users';
import {getTopics, getUserTopic} from '../../service/topics';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex, setTopicFeedByIndex, setTopicFeeds} from '../../context/actions/feeds';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {normalize, normalizeFontSizeByWidth} from '../../utils/fonts';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1
  }
});

let lastDragY = 0;

const TopicPageScreen = (props) => {
  const route = useRoute();
  const {params} = route;
  const navigation = useNavigation();
  const [topicName, setTopicName] = React.useState(route?.params?.id);
  const [loading, setLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [userId, setUserId] = React.useState('');
  const [topicId, setTopicId] = React.useState('');
  const [isHeaderHide, setIsHeaderHide] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);
  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const feeds = feedsContext.topicFeeds;
  const mainFeeds = feedsContext.feeds;
  const [isFollow, setIsFollow] = React.useState(false);
  const [userTopicName, setUserTopicName] = React.useState('');
  const [topicDetail, setTopicDetail] = React.useState({});
  const [offset, setOffset] = React.useState(0);
  const [client] = React.useContext(Context).client;
  const refBlockComponent = React.useRef();
  const interactionManagerRef = React.useRef(null);
  const interactionManagerAnimatedRef = React.useRef(null);

  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.TIKTOK_SCROLL, onRefresh);

  const topicWithPrefix = route.params.id;
  const id = removePrefixTopic(topicWithPrefix);
  const {followTopic} = useChatClientHook();

  const initialFetchTopicFeeds = async (cacheLength = 0) => {
    try {
      const resultGetTopicPages = await getTopicPages(id?.toLowerCase(), 0);
      const {data = [], offset: offsetFeeds = 0} = resultGetTopicPages || {};
      setTopicFeeds(data, dispatch);
      setOffset(offsetFeeds);
      TopicPageStorage.set(id?.toLowerCase(), data, offsetFeeds);

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
      setIsInitialLoading(false);
      setLoading(false);
    }
  };

  const initData = async () => {
    try {
      setIsInitialLoading(true);

      const idLower = id.toLowerCase();
      setTopicName(idLower);
      setUserTopicName(idLower);
      setTopicId(idLower);

      const {feeds: topicFeeds, offset: offsetFeeds} = TopicPageStorage.get(idLower);

      if (topicFeeds?.length > 0) {
        setTopicFeeds(topicFeeds, dispatch);
        setOffset(offsetFeeds);
      }

      initialFetchTopicFeeds(topicFeeds?.length);

      const query = `?name=${idLower}`;
      const resultGetUserTopic = await getUserTopic(query);
      if (resultGetUserTopic.data) {
        setIsFollow(true);
      }
      const resultTopicDetail = await getTopics(idLower);
      if (resultTopicDetail.data) {
        const detail = resultTopicDetail.data[0];
        setTopicDetail(detail);
      }
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
        setLoading(true);
        const result = await getTopicPages(topicId, offsetParam);
        const {data, offset: offsetFeeds} = result;
        if (result.code === 200) {
          if (offsetParam === 0) {
            TopicPageStorage.set(id?.toLowerCase(), data, offsetFeeds);
            setTopicFeeds(data, dispatch);
          } else {
            const joinData = _.uniqBy([...feeds, ...data], (item) => item.id);
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

  const handleFollowTopic = async () => {
    try {
      setLoading(true);
      const followed = await followTopic(userTopicName);
      setIsFollow(followed);
      setLoading(false);
    } catch (error) {
      if (__DEV__) {
        console.log(error);
      }
      setLoading(false);
    }
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
      haveSeeMore
    });
  };

  const onPressComment = (item) => {
    props.navigation.navigate('PostDetailPage', {
      feedId: item.id,
      isalreadypolling: item.isalreadypolling
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

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showHeaderAnimation();
    });

    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      if (interactionManagerAnimatedRef.current) interactionManagerAnimatedRef.current.cancel();

      unsubscribe();
    };
  }, [navigation]);

  const showHeaderAnimation = () => {
    interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
      Animated.timing(offsetAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      }).start();
      Animated.timing(opacityAnimation, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      }).start();
    });
    setIsHeaderHide(false);
  };

  const handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const handleScrollEvent = React.useCallback(
    (event) => {
      const {y} = event.nativeEvent.contentOffset;
      const dy = y - lastDragY;
      if (dy + 30 <= 0) {
        showHeaderAnimation();
      } else if (dy - 20 > 0) {
        interactionManagerAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
          Animated.timing(offsetAnimation, {
            toValue: -(dimen.size.TOPIC_FEED_HEADER_HEIGHT + normalize(4)),
            duration: 100,
            useNativeDriver: false
          }).start();
          Animated.timing(opacityAnimation, {
            toValue: 1,
            duration: 100,
            useNativeDriver: false
          }).start();
        });
        setIsHeaderHide(true);
      }
    },
    [offsetAnimation]
  );

  const saveHeaderhHeightHandle = (height) => {
    if (!headerHeight) {
      setHeaderHeight(Number(height));
    }
  };

  const handleOnMemberPress = (item) => {
    const navigationParam = {
      id: topicName
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
      onPressComment={() => onPressComment(item)}
      onPressBlock={() => onPressBlock(item)}
      onPressUpvote={(post) => setUpVote(post, index)}
      userId={userId}
      onPressDownVote={(post) => setDownVote(post, index)}
      loading={loading}
      selfUserId={userId}
    />
  );

  if (isInitialLoading) return null;
  return (
    <SafeAreaProvider forceInset={{top: 'always'}} style={styles.parentContainer}>
      <StatusBar barStyle="dark-content" translucent={false} />
      <Navigation
        domain={topicName}
        onShareCommunity={onShareCommunity}
        onPress={() => handleFollowTopic()}
        isHeaderHide={isHeaderHide}
        animatedValue={opacityAnimation}
        detail={topicDetail}
      />
      <Header
        domain={topicName}
        onShareCommunity={onShareCommunity}
        onPress={() => handleFollowTopic()}
        isFollow={isFollow}
        getSearchLayout={saveHeaderhHeightHandle}
        animatedValue={offsetAnimation}
        detail={topicDetail}
        handleOnMemberPress={handleOnMemberPress}
      />
      <TiktokScroll
        ref={listRef}
        contentHeight={dimen.size.TOPIC_CURRENT_ITEM_HEIGHT + normalizeFontSizeByWidth(4)}
        data={feeds}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        refreshing={loading}
        renderItem={renderItem}
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}
      />
      <ButtonAddPostTopic topicName={topicName} onRefresh={onRefresh} />
      <BlockComponent
        ref={refBlockComponent}
        refresh={onBlockCompleted}
        refreshAnonymous={onDeleteBlockedPostCompleted}
        screen="topic_screen"
      />
    </SafeAreaProvider>
  );
};
export default withInteractionsManaged(TopicPageScreen);
