import * as React from 'react';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import { Animated, Dimensions, InteractionManager, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { SafeAreaProvider, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useNavigationState } from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import RenderListFeed from './RenderList';
import Search from './elements/Search';
import TiktokScroll from '../../components/TiktokScroll';
import dimen from '../../utils/dimen';
import { ButtonNewPost } from '../../components/Button';
import { COLORS } from '../../utils/theme';
import { Context } from '../../context';
import { DISCOVERY_TAB_TOPICS, SOURCE_FEED_TAB } from '../../utils/constants';
import { FEEDS_CACHE } from '../../utils/cache/constant';
import { downVote, upVote } from '../../service/vote';
import { getFeedDetail, getMainFeed, viewTimePost } from '../../service/post';
import { getSpecificCache, saveToCache } from '../../utils/cache';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setFeedByIndex, setMainFeeds, setTimer } from '../../context/actions/feeds';
import { useAfterInteractions } from '../../hooks/useAfterInteractions';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';

let lastDragY = 0;

const FeedScreen = (props) => {
  const navigation = useNavigation();
  // const [initialLoading, setInitialLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [countStack, setCountStack] = React.useState(null);
  const [showNavbar, setShowNavbar] = React.useState(true)
  // const paddingContainer = React.useRef(new Animated.Value(Platform.OS === 'ios' ? 30 : 50)).current
  // const [time, setTime] = React.useState(new Date());
  // const [viewPostTimeIndex, setViewPostTimeIndex] = React.useState(0)
  const [postOffset, setPostOffset] = React.useState(0)
  // const [selectedFeed, setSelectedFeed] = React.useState(null)
  const offset = React.useRef(new Animated.Value(0)).current
  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const [profileContext] = React.useContext(Context).profile;
  const [searchHeight, setSearchHeight] = React.useState(0)
  const { interactionsComplete } = useAfterInteractions()
  const { feeds, timer, viewPostTimeIndex } = feedsContext;
  const { myProfile } = profileContext

  const { bottom } = useSafeAreaInsets();
  const [isScroll, setIsScroll] = React.useState(false)

  const getDataFeeds = async (offset = 0, useLoading) => {
    setCountStack(null);
    if (useLoading) {
      setLoading(true);
    }
    try {
      const query = `?offset=${offset}`

      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        const { data } = dataFeeds;
        const dataWithDummy = [...data, { dummy: true }]
        let saveData = {
          offset: dataFeeds.offset,
          data: dataWithDummy

        }
        if (offset === 0) {
          // setMainFeeds(data, dispatch);
          setMainFeeds(dataWithDummy, dispatch);
          saveToCache(FEEDS_CACHE, saveData)
        } else {
          const clonedFeeds = [...feeds]
          clonedFeeds.splice(feeds.length - 1, 0, ...data)
          saveData = {
            ...saveData,
            data: clonedFeeds
          }
          setMainFeeds(clonedFeeds, dispatch);
          saveToCache(FEEDS_CACHE, saveData)
          // setMainFeeds([...feeds, ...data], dispatch)
        }
        setCountStack(data.length);
      }

      setPostOffset(dataFeeds.offset)

      // setTime(new Date());
      setTimer(new Date(), dispatch)
      setLoading(false);
    } catch (e) {
      setLoading(false);
    }
  };

  const onDeleteBlockedPostCompleted = async (postId) => {
    const postIndex = feeds.findIndex((item) => item.id === postId)
    const clonedFeeds = [...feeds]
    clonedFeeds.splice(postIndex, 1)
    setMainFeeds(clonedFeeds, dispatch)
  }

  const onBlockCompleted = async (postId) => {
    onDeleteBlockedPostCompleted(postId)

    await getDataFeeds(0, true)
  }

  React.useEffect(() => {
    if (interactionsComplete) {
      analytics().logScreenView({
        screen_class: 'FeedScreen',
        screen_name: 'Feed Screen',
      });

      checkCache()
    }

  }, [interactionsComplete]);
  const checkCache = () => {
    getSpecificCache(FEEDS_CACHE, (result) => {
      if (result) {
        setMainFeeds(result.data, dispatch)
        setPostOffset(result.offset)

      } else {
        getDataFeeds()
      }
    })
  }
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      // getDataFeeds();
      showSearchBarAnimation()
    });

    return unsubscribe;
  }, [navigation]);

  // React.useEffect(() => {
  //   if(interactionsComplete) {
  //     searchBarDebounce = setTimeout(async () => {
  //       showSearchBar(false)
  //       setShouldSearchBarShown(false)
  //     }, 2000)
  //   }

  // }, [shouldSearchBarShown]);

  // React.useEffect(() => {
  //   InteractionManager.runAfterInteractions(() => {
  //     setInitialLoading(false)
  //   })
  // }, [])

  const updateFeed = async (post, index) => {
    try {
      const data = await getFeedDetail(post.activity_id);
      if (data) {
        setFeedByIndex(
          {
            singleFeed: data.data,
            index,
          },
          dispatch,
        );
      }
    } catch (e) {
    }
  };
  const setUpVote = async (post, index) => {
    const processVote = await upVote(post);
    updateFeed(post, index);
    return processVote;
  };
  const setDownVote = async (post, index) => {
    const processVote = await downVote(post);
    updateFeed(post, index);
    return processVote
  };

  const sendViewPost = () => {
    const currentTime = new Date()
    const diffTime = currentTime.getTime() - timer.getTime()
    const id = feeds[viewPostTimeIndex]?.id
    if (id) viewTimePost(id, diffTime, SOURCE_FEED_TAB);

  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };


  const onPressDomain = (item) => {
    const param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    sendViewPost()
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    // Use -2 because last item is dummy
    // getDataFeeds(feeds[feeds.length - 2].id);
    getDataFeeds(postOffset);
  };

  const onPress = (item) => {
    props.navigation.navigate('PostDetailPage', {
      // index: index,
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      // refreshParent:  getDataFeeds,
      data: item,
      isCaching: true

    });
  };

  const onPressComment = (index, item) => {
    props.navigation.navigate('PostDetailPage', {
      // index: index,
      feedId: item.id,
      // refreshParent: getDataFeeds,
      data: item,
      isCaching: true
      // feedId:
    });
  };

  const onPressBlock = (value) => {
    refBlockComponent.current.openBlockComponent(value);
    // setSelectedFeed(value)
  };

  const onRefresh = () => {
    getDataFeeds(0, true);
  };

  // const showSearchBar = (isShown) => {
  //   return Animated.timing(offset, {
  //     toValue: isShown ? 0 : -70,
  //     duration: Platform.OS === 'ios' ? 30 : 50,
  //     useNativeDriver: false,
  //   }).start();
  // }

  // let debounceSearchBar = (event) => {
  //   let y = event.nativeEvent.contentOffset.y;
  //   let dy = y - lastDragY;

  //   if(dy <= 0) {
  //     clearTimeout(searchBarDebounce)
  //     setShouldSearchBarShown(new Date().getTime())
  //   }
  // }

  const handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  // let handleOnMomentumEnd = (event) => {
  //   onWillSendViewPostTime(event)
  //   debounceSearchBar(event)
  // }

  const showSearchBarAnimation = () => {
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(offset, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false,
      }).start();
      // Animated.timing(paddingContainer, {
      //   toValue: Platform.OS === 'ios' ? 30 : 50,
      //   duration: 100,
      //   useNativeDriver: false,
      // }).start()

    })
    setShowNavbar(true)

  }
  const handleScrollEvent = React.useCallback((event) => {
    setIsScroll(true)
    const { y } = event.nativeEvent.contentOffset;
    const dy = y - lastDragY;
    if (dy + 20 <= 0) {
      showSearchBarAnimation()

    } else if (dy - 20 > 0) {
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: -50,
          duration: 100,
          useNativeDriver: false,
        }).start();
        // Animated.timing(paddingContainer, {
        //   toValue: 0,
        //   duration: 100,
        //   useNativeDriver: false,
        // }).start()

      })
      setShowNavbar(false)
    }
  }, [offset])


  // let onWillSendViewPostTime = (event) => {
  //   sendViewPost()

  //   let y = event.nativeEvent.contentOffset.y;
  //   let shownIndex = Math.ceil(y / dimen.size.FEED_CURRENT_ITEM_HEIGHT)
  //   setViewPostTimeIndex(shownIndex, dispatch)
  //   setTimer(new Date(), dispatch)
  // }

  const handleSearchBarClicked = () => {
    sendViewPost()

    navigation.navigate('DiscoveryScreen', {
      tab: DISCOVERY_TAB_TOPICS
    })

    setTimer(new Date(), dispatch)
  }

  const saveSearchHeight = (height) => {
    if (!searchHeight) {
      setSearchHeight(Number(height))

    }
  }

  return (
    <SafeAreaProvider style={styles.container} forceInset={{ top: 'always' }}>
      <StatusBar translucent={false} />

      <Search getSearchLayout={saveSearchHeight} animatedValue={offset} onContainerClicked={handleSearchBarClicked} />
      <TiktokScroll
        contentHeight={dimen.size.FEED_CURRENT_ITEM_HEIGHT}
        data={feeds}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        searchHeight={searchHeight}
        showSearchBar={showNavbar}
        refreshing={loading}>
        {({ item, index }) => {
          if (item.dummy) return null
          return <RenderListFeed
            item={item}
            onNewPollFetched={onNewPollFetched}
            index={index}
            onPressDomain={onPressDomain}
            onPress={() => onPress(item, index)}
            onPressComment={() => onPressComment(index, item)}
            onPressBlock={() => onPressBlock(item)}
            onPressUpvote={(post) => setUpVote(post, index)}
            selfUserId={myProfile.user_id}
            onPressDownVote={(post) => setDownVote(post, index)}
            loading={loading}
            showNavbar={showNavbar}
            searchHeight={searchHeight}
            bottomArea={bottom}
            isScroll={isScroll}
          />
        }}
      </TiktokScroll>
      <ButtonNewPost />
      <BlockComponent ref={refBlockComponent}
        refresh={onBlockCompleted}
        refreshAnonymous={onDeleteBlockedPostCompleted}
        screen="screen_feed" />
    </SafeAreaProvider>

  );
};

export default React.memo(withInteractionsManaged(FeedScreen));
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  dummyItem: (height) => ({
    height,
    backgroundColor: COLORS.gray1,
  }),
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistContainer: {
    paddingBottom: 0,
  },
});
