import * as React from 'react';
import {Animated, InteractionManager, StatusBar, View, useWindowDimensions} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import RenderListFeed from './RenderList';
import Search from './elements/Search';
import StorageUtils from '../../utils/storage';
import TiktokScroll from '../../components/TiktokScroll';
import dimen from '../../utils/dimen';
import useAnonymousChannelListScreenHook from '../../hooks/screen/useAnonymousChannelListHook';
import useCoreFeed from './hooks/useCoreFeed';
import useViewPostTimeHook from './hooks/useViewPostTimeHook';
import AnalyticsEventTracking, {
  BetterSocialEventTracking
} from '../../libraries/analytics/analyticsEventTracking';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import {ButtonNewPost} from '../../components/Button';
import {Context} from '../../context';
import {DISCOVERY_TAB_TOPICS} from '../../utils/constants';
import {Shimmer} from '../../components/Shimmer/Shimmer';
import {linkContextScreenParamBuilder} from '../../utils/navigation/paramBuilder';
import {setFeedByIndex} from '../../context/actions/feeds';
import {useAfterInteractions} from '../../hooks/useAfterInteractions';
import useDiscovery from '../DiscoveryScreenV2/hooks/useDiscovery';

let lastDragY = 0;

const FeedScreen = (props) => {
  const navigation = useNavigation();
  const offset = React.useRef(new Animated.Value(0)).current;
  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.TIKTOK_SCROLL, onRefresh);
  const route = useRoute();

  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const {interactionsComplete} = useAfterInteractions();
  const {feeds} = feedsContext;

  const [isScroll, setIsScroll] = React.useState(false);
  const [updateIndex, setUpdateIndex] = React.useState(0);
  const {
    bottom,
    loading,
    myProfile,
    searchHeight,
    showNavbar,
    timer,
    viewPostTimeIndex,

    checkCacheFeed,
    fetchNextFeeds,
    getDataFeeds,
    handleScroll,
    onBlockCompleted,
    onDeleteBlockedPostCompleted,
    saveSearchHeight,
    sendViewPostTime,
    setDownVote,
    setIsLastPage,
    setShowNavbar,
    setUpVote
  } = useCoreFeed();

  const {topics} = useDiscovery();

  const {channels: anonChannels} = useAnonymousChannelListScreenHook();

  const {onWillSendViewPostTime} = useViewPostTimeHook(dispatch, timer, viewPostTimeIndex);

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
  const [updateMoreText, setUpdateMoreText] = React.useState(false);
  React.useEffect(() => {
    if (interactionsComplete) {
      checkCacheFeed();
    }
  }, [interactionsComplete]);

  React.useEffect(() => {
    if (anonChannels.length > 0) {
      StorageUtils.totalAnonChannels.set(anonChannels.length?.toString() || '0');
    }
  }, [anonChannels.length]);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      if (!route.params.isGoBack) {
        showSearchBarAnimation();
      }
    });

    return () => {
      if (interactionManagerRef.current) interactionManagerRef.current.cancel();
      if (interactionManagerAnimatedRef.current) interactionManagerAnimatedRef.current.cancel();

      unsubscribe();
    };
  }, [navigation, route.params.isGoBack]);

  const setUpVoteHandle = async (post, index) => {
    setUpVote(post, index);
  };

  const setDownVoteHandle = async (post, index) => {
    setDownVote(post, index);
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
    sendViewPostTime(true);
    props.navigation.navigate('DomainScreen', param);
  };

  const refreshMoreText = (index, haveSeeMore) => {
    setUpdateIndex(index);
    if (haveSeeMore) {
      setUpdateMoreText(true);
      setTimeout(() => {
        setUpdateMoreText(false);
      }, 1);
    }
  };

  const onPress = (item, haveSeeMore, index) => {
    props.navigation.navigate('PostDetailPage', {
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      data: item,
      isCaching: true,
      haveSeeMore,
      refreshParent: () => refreshMoreText(index, haveSeeMore),
      fromFeeds: true
    });
  };

  const onPressComment = (item, haveSeeMore, index) => {
    props.navigation.navigate('PostDetailPage', {
      isalreadypolling: item.isalreadypolling,
      feedId: item.id,
      data: item,
      isCaching: true,
      haveSeeMore,
      refreshParent: () => refreshMoreText(index, haveSeeMore),
      isKeyboardOpen: true
    });

    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_POST_FOOTER_REPLY_BUTTON_CLICKED
    );
  };

  const onPressBlock = (value) => {
    refBlockComponent.current.openBlockComponent(value);
    AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.MAIN_FEED_BLOCK_BUTTON_CLICKED);
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
  React.useEffect(() => {
    if (route.params?.isGoBack) {
      interactionManagerAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: -50,
          duration: 100,
          useNativeDriver: false
        }).start();
      });
      setShowNavbar(false);
    }
  }, [route.params]);

  const handleSearchBarClicked = () => {
    sendViewPostTime(true);

    navigation.navigate('DiscoveryScreen', {
      tab: DISCOVERY_TAB_TOPICS,
      initialTopics: topics
    });

    AnalyticsEventTracking.eventTrack(BetterSocialEventTracking.MAIN_FEED_SEARCH_BAR_CLICKED);
  };

  const saveSearchHeightHandle = (height) => {
    saveSearchHeight(height);
  };

  const renderListFeed = (item, index) => (
    <RenderListFeed
      key={item.id}
      item={item}
      onNewPollFetched={onNewPollFetched}
      index={index}
      onPressDomain={onPressDomain}
      onPress={(haveSeeMore) => {
        onPress(feeds[index], haveSeeMore, index);
      }}
      onPressComment={(haveSeeMore) => onPressComment(item, haveSeeMore, index)}
      onPressBlock={() => onPressBlock(item)}
      onPressUpvote={(post) => setUpVoteHandle(post, index)}
      selfUserId={myProfile.user_id}
      onPressDownVote={(post) => setDownVoteHandle(post, index)}
      loading={loading}
      showNavbar={showNavbar}
      searchHeight={searchHeight}
      bottomArea={bottom}
      isScroll={isScroll}
      hideThreeDot={false}
      isSelf={item.is_self}
    />
  );
  const {width: displayWidth} = useWindowDimensions();

  const renderItem = ({item, index}) => {
    if (item.dummy) return <React.Fragment key={index} />;
    if (updateMoreText && updateIndex === index) return null;
    return renderListFeed(item, index);
  };

  const onCloseBlockUser = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_BLOCK_USER_BOTTOM_SHEET_CLOSED
    );
  };

  const onBlockAndReportUser = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_BLOCK_USER_BLOCK_AND_REPORT_CLICKED
    );
  };

  const onBlockUserIndefinitely = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_BLOCK_USER_BLOCK_INDEFINITELY_CLICKED
    );
  };

  const onSkipOnlyBlock = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_BLOCK_USER_REPORT_INFO_SKIPPED
    );
  };

  const onReportInfoSubmitted = () => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_BLOCK_USER_REPORT_INFO_SUBMITTED
    );
  };

  const onReasonsSubmitted = (v) => {
    AnalyticsEventTracking.eventTrack(
      BetterSocialEventTracking.MAIN_FEED_BLOCK_USER_BLOCK_AND_REPORT_REASON,
      v
    );
  };

  return (
    <View>
      <StatusBar translucent={false} barStyle={'light-content'} />
      <Search
        getSearchLayout={saveSearchHeightHandle}
        animatedValue={offset}
        onContainerClicked={handleSearchBarClicked}
      />
      {Array.isArray(feeds) && feeds.length <= 0 && (
        <View
          style={{
            width: displayWidth,
            marginTop: 20
          }}>
          <View style={{marginVertical: 24}}>
            <Shimmer height={400} width={displayWidth} />
          </View>
          <View style={{marginVertical: 24}}>
            <Shimmer height={400} width={displayWidth} />
          </View>
        </View>
      )}
      <TiktokScroll
        ref={listRef}
        contentHeight={dimen.size.FEED_CURRENT_ITEM_HEIGHT}
        data={feeds}
        onRefresh={onRefresh}
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        searchHeight={searchHeight}
        showSearchBar={showNavbar}
        refreshing={loading}
        renderItem={renderItem}
        onEndReachedThreshold={0.9}
        onMomentumScrollEnd={(momentumEvent) => {
          onWillSendViewPostTime(momentumEvent, feeds, {
            scrollEventName: BetterSocialEventTracking.MAIN_FEED_ON_POST_SCROLLED,
            scrollEventItemName: BetterSocialEventTracking.MAIN_FEED_ON_POST_SCROLLED_ITEM
          });
          fetchNextFeeds(momentumEvent);
        }}
      />
      <ButtonNewPost
        onRefresh={onRefresh}
        clickEventName={BetterSocialEventTracking.MAIN_FEED_CREATE_POST_BUTTON_CLICKED}
      />
      <BlockComponent
        ref={refBlockComponent}
        refresh={onBlockCompletedHandle}
        refreshAnonymous={onDeleteBlockedPostCompletedHandle}
        screen="screen_feed"
        onCloseBlockUser={onCloseBlockUser}
        onBlockAndReportUser={onBlockAndReportUser}
        onBlockUserIndefinitely={onBlockUserIndefinitely}
        onSkipOnlyBlock={onSkipOnlyBlock}
        onReportInfoSubmitted={onReportInfoSubmitted}
        onReasonsSubmitted={onReasonsSubmitted}
      />
    </View>
  );
};

export default FeedScreen;
