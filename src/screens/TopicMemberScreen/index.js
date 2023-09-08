import * as React from 'react';
import _ from 'lodash';
import SimpleToast from 'react-native-simple-toast';
import {Animated, InteractionManager, ScrollView, StatusBar, StyleSheet} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import {SafeAreaProvider} from 'react-native-safe-area-context';
import ShareUtils from '../../utils/share';
import TopicPageStorage from '../../utils/storage/custom/topicPageStorage';
import dimen from '../../utils/dimen';
import removePrefixTopic from '../../utils/topics/removePrefixTopic';
import useChatClientHook from '../../utils/getstream/useChatClientHook';
import {Context} from '../../context';
import {getTopicPages} from '../../service/topicPages';
import {getUserId} from '../../utils/users';
import {getTopics, getUserTopic} from '../../service/topics';
import {setTopicFeeds} from '../../context/actions/feeds';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';
import {normalize} from '../../utils/fonts';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import Search from './elements/Search';
import MemberList from './elements/MemberList';
import Navigation from '../TopicPageScreen/elements/Navigation';
import Header from '../TopicPageScreen/elements/Header';

const styles = StyleSheet.create({
  parentContainer: {
    flex: 1
  },
  fragmentContentContainer: {
    // height: '100%'
    flexGrow: 1
  }
});

let lastDragY = 0;

const TopicMemberScreen = (props) => {
  const route = useRoute();
  const {params} = route;
  const navigation = useNavigation();
  const [topicName, setTopicName] = React.useState(route?.params?.id);
  const [loading, setLoading] = React.useState(false);
  const [isInitialLoading, setIsInitialLoading] = React.useState(true);
  const [userId, setUserId] = React.useState('');
  const [topicId, setTopicId] = React.useState('');
  const [searchHeight, setSearchHeight] = React.useState(0);
  const [isHeaderHide, setIsHeaderHide] = React.useState(false);
  const [headerHeight, setHeaderHeight] = React.useState(0);

  const [searchText, setSearchText] = React.useState('');
  const [discoveryDataFollowedUsers, setDiscoveryDataFollowedUsers] = React.useState([]);
  const [discoveryDataUnfollowedUsers, setDiscoveryDataUnfollowedUsers] = React.useState([]);
  const [isFirstTimeOpen, setIsFirstTimeOpen] = React.useState(true);

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

  const offsetAnimation = React.useRef(new Animated.Value(0)).current;
  const opacityAnimation = React.useRef(new Animated.Value(0)).current;

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

  const onEndReach = () => {
    refreshingData(offset);
  };

  const onRefresh = () => {
    refreshingData(0);
  };

  const onShareCommunity = () => {
    ShareUtils.shareCommunity(topicName);
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
            toValue: -(
              dimen.size.TOPIC_FEED_HEADER_HEIGHT +
              dimen.size.DISCOVERY_HEADER_HEIGHT +
              normalize(4)
            ),
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

  const saveSearchHeightHandle = (height) => {
    setSearchHeight(height);
  };

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
      <Search
        getSearchLayout={saveSearchHeightHandle}
        animatedValue={offset}
        onContainerClicked={() => {}}
      />
      <ScrollView
        style={styles.fragmentContainer}
        contentContainerStyle={styles.fragmentContentContainer}
        keyboardShouldPersistTaps="handled"
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}>
        <MemberList
          isLoadingDiscoveryUser={loading}
          isFirstTimeOpen={false}
          setIsFirstTimeOpen={setIsFirstTimeOpen}
          followedUsers={discoveryDataFollowedUsers}
          unfollowedUsers={discoveryDataUnfollowedUsers}
          setFollowedUsers={setDiscoveryDataFollowedUsers}
          setUnfollowedUsers={setDiscoveryDataUnfollowedUsers}
          setSearchText={setSearchText}
          topicName={topicName}
        />
      </ScrollView>
    </SafeAreaProvider>
  );
};
export default withInteractionsManaged(TopicMemberScreen);
