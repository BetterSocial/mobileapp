import * as React from 'react';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import { Animated, Dimensions, InteractionManager, Platform, StatusBar, StyleSheet, View } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation, useNavigationState } from '@react-navigation/native';
import { SafeAreaProvider, useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';
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
import { getUserId } from '../../utils/users';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setFeedByIndex, setMainFeeds, setTimer, setViewPostTimeIndex } from '../../context/actions/feeds';
import { withInteractionsManaged } from '../../components/WithInteractionManaged';
import { useAfterInteractions } from '../../hooks/useAfterInteractions';

let lastDragY = 0;
let searchBarDebounce

const FeedScreen = (props) => {
  const navigation = useNavigation();
  // const [initialLoading, setInitialLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [countStack, setCountStack] = React.useState(null);
  const [lastId, setLastId] = React.useState('');
  const [yourselfId, setYourselfId] = React.useState('');
  const [showNavbar, setShowNavbar] = React.useState(true)
  // const paddingContainer = React.useRef(new Animated.Value(Platform.OS === 'ios' ? 30 : 50)).current
  const frameHeight = useSafeAreaFrame().height
  // const [time, setTime] = React.useState(new Date());
  // const [viewPostTimeIndex, setViewPostTimeIndex] = React.useState(0)
  const [shouldSearchBarShown, setShouldSearchBarShown] = React.useState(0)
  const [postOffset, setPostOffset] = React.useState(0)
  // const [selectedFeed, setSelectedFeed] = React.useState(null)
  const offset = React.useRef(new Animated.Value(0)).current
  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const [profileContext] = React.useContext(Context).profile;
  const bottomBarHeight = useBottomTabBarHeight();
  const [searchHeight, setSearchHeight] = React.useState(0)
  const { height } = Dimensions.get('screen');
  const {interactionsComplete} = useAfterInteractions()
  let { feeds, timer, viewPostTimeIndex } = feedsContext;
  let {myProfile} = profileContext
  const bottomHeight = useBottomTabBarHeight();
  const { bottom } = useSafeAreaInsets();
  const [isScroll, setIsScroll] = React.useState(false)

  const getDataFeeds = async (offset = 0, useLoading) => {
    setCountStack(null);
    if(useLoading) {
          setLoading(true);
    } 
    try {
      let query = `?offset=${offset}`

      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        let dataWithDummy = [...data, {dummy : true}]
        let saveData = {
          offset: dataFeeds.offset,
          data: dataWithDummy
         
        }
        if (offset === 0) {
          // setMainFeeds(data, dispatch);
          setMainFeeds(dataWithDummy, dispatch);
          saveToCache(FEEDS_CACHE, saveData)
        } else {
          let clonedFeeds = [...feeds]
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

  React.useEffect(() => {
    if(interactionsComplete) {
      analytics().logScreenView({
        screen_class: 'FeedScreen',
        screen_name: 'Feed Screen',
      });
  
      checkCache()
    }

  }, [interactionsComplete]);
  const checkCache = () => {
    getSpecificCache(FEEDS_CACHE, (result) => {
      if(result) {
        setMainFeeds(result.data, dispatch)
        setPostOffset(result.offset)

      } else {
        getDataFeeds()
      }
    })
  }
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', (e) => {
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
      let data = await getFeedDetail(post.activity_id);
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
    let currentTime = new Date()
    let diffTime = currentTime.getTime() - timer.getTime()
    let id = feeds[viewPostTimeIndex]?.id
    if(id) viewTimePost(id, diffTime, SOURCE_FEED_TAB);

  };

  let onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index: index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };


  const onPressDomain = (item) => {
    let param = linkContextScreenParamBuilder(
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

  const onPress = (item, index) => {
    props.navigation.navigate('PostDetailPage', {
      // index: index,
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      // refreshParent:  getDataFeeds,
      data: item,
      isCaching:true
      
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

  const showSearchBar = (isShown) => {
    return Animated.timing(offset, {
      toValue: isShown ? 0 : -70,
      duration: Platform.OS === 'ios' ? 30 : 50,
      useNativeDriver: false,
    }).start();
  }

  let debounceSearchBar = (event) => {
    let y = event.nativeEvent.contentOffset.y;
    let dy = y - lastDragY;

    if(dy <= 0) {
      clearTimeout(searchBarDebounce)
      setShouldSearchBarShown(new Date().getTime())
    }
  }

  let handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  let handleOnMomentumEnd = (event) => {
    onWillSendViewPostTime(event)
    debounceSearchBar(event)
  }

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
  let handleScrollEvent = React.useCallback((event) => {
    setIsScroll(true)
    let y = event.nativeEvent.contentOffset.y;
    let dy = y - lastDragY;
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


  let onWillSendViewPostTime = (event) => {
    sendViewPost()
    
    let y = event.nativeEvent.contentOffset.y;
    let shownIndex = Math.ceil(y / dimen.size.FEED_CURRENT_ITEM_HEIGHT)
    setViewPostTimeIndex(shownIndex, dispatch)
    setTimer(new Date(), dispatch)
  }

  let handleSearchBarClicked = () => {
    sendViewPost()

    navigation.navigate('DiscoveryScreen', {
      tab: DISCOVERY_TAB_TOPICS
    })

    setTimer(new Date(), dispatch)
  }

  const saveSearchHeight = (height) => {
    if(!searchHeight) {
      setSearchHeight(Number(height))

    }
  }


  return (
    <SafeAreaProvider style={styles.container} forceInset={{ top: 'always' }}>
      <Search getSearchLayout={saveSearchHeight} animatedValue={offset} onContainerClicked={handleSearchBarClicked}/>
      {/* <Animated.View style={{paddingTop: paddingContainer}}/> */}
      <TiktokScroll
        contentHeight={(Dimensions.get('screen').height - StatusBar.currentHeight - bottomBarHeight) * 0.8}
        data={feeds}
        onEndReach={onEndReach}
        
        // onMomentumScrollEnd={handleOnMomentumEnd}
        onRefresh={onRefresh}
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        
        // onScrollBeginDrag={handleOnScrollBeginDrag}
        refreshing={loading}>
        {({ item, index }) => {
          if(item.dummy) return null
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
      <BlockComponent ref={refBlockComponent} refresh={getDataFeeds} screen="screen_feed" />
    </SafeAreaProvider>

  );
};

export default React.memo (withInteractionsManaged (FeedScreen));
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  dummyItem : (height) => ({
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
