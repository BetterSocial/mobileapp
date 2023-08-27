import * as React from 'react';
import {Animated, InteractionManager, StatusBar, StyleSheet} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import RenderListFeed from './RenderList';
import Search from './elements/Search';
import TiktokScroll from '../../components/TiktokScroll';
import dimen from '../../utils/dimen';
import useCoreFeed from './hooks/useCoreFeed';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import {ButtonNewPost} from '../../components/Button';
import {Context} from '../../context';
import {DISCOVERY_TAB_TOPICS, SOURCE_FEED_TAB} from '../../utils/constants';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {normalizeFontSizeByWidth} from '../../utils/fonts';
import {setFeedByIndex, setTimer} from '../../context/actions/feeds';
import {useAfterInteractions} from '../../hooks/useAfterInteractions';
import {viewTimePost} from '../../service/post';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

let lastDragY = 0;

const FeedScreen = (props) => {
  const navigation = useNavigation();
  const offset = React.useRef(new Animated.Value(0)).current;
  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.TIKTOK_SCROLL, onRefresh);

  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const {interactionsComplete} = useAfterInteractions();
  const {feeds, timer, viewPostTimeIndex} = feedsContext;
  const [isScroll, setIsScroll] = React.useState(false);
  const {
    getDataFeeds,
    postOffset,
    loading,
    setShowNavbar,
    showNavbar,
    myProfile,
    bottom,
    onDeleteBlockedPostCompleted,
    onBlockCompleted,
    checkCacheFeed,
    setUpVote,
    setDownVote,
    saveSearchHeight,
    searchHeight,
    handleScroll,
    setIsLastPage,
    nextTargetFeed
  } = useCoreFeed();
  const interactionManagerRef = React.useRef(null);
  const interactionManagerAnimatedRef = React.useRef(null);
  const getDataFeedsHandle = async (offsetFeed = 0, useLoading = false, targetFeed = null) => {
    getDataFeeds(offsetFeed, useLoading, targetFeed);
  };
  const onDeleteBlockedPostCompletedHandle = async (postId) => {
    onDeleteBlockedPostCompleted(postId);
  };
  const onBlockCompletedHandle = async (postId) => {
    onBlockCompleted(postId);
  };

  React.useEffect(() => {
    if (interactionsComplete) {
      checkCacheFeed();
    }
  }, [interactionsComplete]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      showSearchBarAnimation();
    });

    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      if (interactionManagerAnimatedRef.current) interactionManagerAnimatedRef.current.cancel();

      unsubscribe();
    };
  }, [navigation]);

  const setUpVoteHandle = async (post, index) => {
    setUpVote(post, index);
  };

  const setDownVoteHandle = async (post, index) => {
    setDownVote(post, index);
  };

  const sendViewPost = () => {
    const currentTime = new Date();
    const diffTime = currentTime.getTime() - timer.getTime();
    const id = feeds && feeds[viewPostTimeIndex]?.id;
    if (id) viewTimePost(id, diffTime, SOURCE_FEED_TAB);
  };

  const onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
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
    sendViewPost();
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    getDataFeedsHandle(postOffset, false, nextTargetFeed);
  };

  const onPress = (item) => {
    props.navigation.navigate('PostDetailPage', {
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      data: item,
      isCaching: false
    });
  };

  const onPressComment = (index, item) => {
    props.navigation.navigate('PostDetailPage', {
      // index: index,
      feedId: item.id,
      // refreshParent: getDataFeedsHandle,
      data: item,
      isCaching: true
      // feedId:
    });
  };

  const onPressBlock = (value) => {
    refBlockComponent.current.openBlockComponent(value);
  };

  function onRefresh() {
    getDataFeedsHandle(0, true);
    setIsLastPage(false);
    handleScroll(false);
  }

  const handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const showSearchBarAnimation = () => {
    interactionManagerRef.current = InteractionManager.runAfterInteractions(() => {
      Animated.timing(offset, {
        toValue: 0,
        duration: 100,
        useNativeDriver: false
      }).start();
    });
    setShowNavbar(true);
  };
  const handleScrollEvent = React.useCallback(
    (event) => {
      setIsScroll(true);
      handleScroll(true);
      const {y} = event.nativeEvent.contentOffset;
      const dy = y - lastDragY;
      if (dy + 20 <= 0) {
        showSearchBarAnimation();
      } else if (dy - 20 > 0) {
        interactionManagerAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
          Animated.timing(offset, {
            toValue: -50,
            duration: 100,
            useNativeDriver: false
          }).start();
        });
        setShowNavbar(false);
      }
    },
    [offset]
  );

  const handleSearchBarClicked = () => {
    sendViewPost();

    navigation.navigate('DiscoveryScreen', {
      tab: DISCOVERY_TAB_TOPICS
    });

    setTimer(new Date(), dispatch);
  };

  const saveSearchHeightHandle = (height) => {
    saveSearchHeight(height);
  };

  const renderItem = ({item, index}) => {
    if (item.dummy) return <React.Fragment key={index} />;
    return (
      <RenderListFeed
        key={item.id}
        item={item}
        onNewPollFetched={onNewPollFetched}
        index={index}
        onPressDomain={onPressDomain}
        onPress={() => onPress(item)}
        onPressComment={() => onPressComment(index, item)}
        onPressBlock={() => onPressBlock(item)}
        onPressUpvote={(post) => setUpVoteHandle(post, index)}
        selfUserId={myProfile.user_id}
        onPressDownVote={(post) => setDownVoteHandle(post, index)}
        loading={loading}
        showNavbar={showNavbar}
        searchHeight={searchHeight}
        bottomArea={bottom}
        isScroll={isScroll}
      />
    );
  };

  return (
    <SafeAreaProvider style={styles.container} forceInset={{top: 'always'}}>
      <StatusBar translucent={false} />
      <Search
        getSearchLayout={saveSearchHeightHandle}
        animatedValue={offset}
        onContainerClicked={handleSearchBarClicked}
      />
      <TiktokScroll
        ref={listRef}
        contentHeight={dimen.size.FEED_CURRENT_ITEM_HEIGHT + normalizeFontSizeByWidth(4)}
        data={feeds}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        searchHeight={searchHeight}
        showSearchBar={showNavbar}
        refreshing={loading}
        renderItem={renderItem}
        onEndReachedThreshold={0.9}
      />
      <ButtonNewPost onRefresh={onRefresh} />
      <BlockComponent
        ref={refBlockComponent}
        refresh={onBlockCompletedHandle}
        refreshAnonymous={onDeleteBlockedPostCompletedHandle}
        screen="screen_feed"
      />
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  flatlistContainer: {
    paddingBottom: 0
  }
});

export default React.memo(withInteractionsManaged(FeedScreen));
