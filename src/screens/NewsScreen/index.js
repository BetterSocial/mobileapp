import * as React from 'react';
import {
  Animated,
  FlatList,
  InteractionManager,
  Platform,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  View
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

import BlockDomainComponent from '../../components/BlockDomain';
import RenderItem from './RenderItem';
import Search from './Search';
import ShareUtils from '../../utils/share';
import useOnBottomNavigationTabPressHook, {
  LIST_VIEW_TYPE
} from '../../hooks/navigation/useOnBottomNavigationTabPressHook';
import {COLORS} from '../../utils/theme';
import {Context} from '../../context';
import {NEWS_CACHE} from '../../utils/cache/constant';
import {downVoteDomain, upVoteDomain} from '../../service/vote';
import {getDomainIdIFollow, getDomains} from '../../service/domain';
import {getSpecificCache, saveToCache} from '../../utils/cache';
import {setIFollow, setNews} from '../../context/actions/news';
import {useAfterInteractions} from '../../hooks/useAfterInteractions';
import {withInteractionsManaged} from '../../components/WithInteractionManaged';

const NewsScreen = () => {
  const navigation = useNavigation();
  const {listRef} = useOnBottomNavigationTabPressHook(LIST_VIEW_TYPE.FLAT_LIST);
  const safeInsets = useSafeAreaInsets();

  const refBlockDomainComponent = React.useRef(null);
  const offset = React.useRef(new Animated.Value(0)).current;
  const paddingContainer = React.useRef(new Animated.Value(50)).current;
  const [refreshing, setRefreshing] = React.useState(false);
  const [domain, setDomain] = React.useState('');
  const [idBlock, setIdBlock] = React.useState('');
  const [postOffset, setPostOffset] = React.useState(0);
  const [newslist, dispatch] = React.useContext(Context).news;
  const {interactionsComplete} = useAfterInteractions();
  const [profileContext] = React.useContext(Context).profile;
  const {myProfile} = profileContext;

  const interactionAnimatedRef = React.useRef(null);

  const {news} = newslist;
  let lastDragY = 0;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('blur', () => {
      offset.setValue(0);
      // checkCache()
    });

    return () => {
      unsubscribe();
      if (interactionAnimatedRef.current) interactionAnimatedRef.current.cancel();
    };
  }, []);

  React.useEffect(() => {
    if (interactionsComplete) {
      checkCache();
      getNewsIfollow();
    }
  }, [interactionsComplete]);

  const checkCache = () => {
    getSpecificCache(NEWS_CACHE, (cache) => {
      if (cache) {
        setNews(cache.data, dispatch);
        setPostOffset(cache.offset);
      } else {
        initData();
      }
    });
  };

  React.useEffect(() => {
    if (interactionsComplete) {
      if (domain !== '' && idBlock !== '') {
        refBlockDomainComponent.current.openBlockDomain();
      }
    }
  }, [domain, idBlock, interactionsComplete]);

  const initData = async () => {
    try {
      const res = await getDomains();
      saveToCache(NEWS_CACHE, res);
      setNews(res.data, dispatch);
      setPostOffset(res.offset);
      // setLoading(false);
    } catch (error) {
      // setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      const res = await getDomains();
      setNews(res.data, dispatch);
      setPostOffset(res.offset);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const getNewsIfollow = async () => {
    const res = await getDomainIdIFollow();
    setIFollow(res.data, dispatch);
  };

  const handleScrollEvent = (event) => {
    console.log(safeInsets);
    const {y} = event.nativeEvent.contentOffset;
    const dy = y - lastDragY;
    if (dy + 20 <= safeInsets.top) {
      interactionAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false
        }).start();
        // Animated.timing(paddingContainer, {
        //   toValue: safeInsets.top,
        //   duration: 100,
        //   useNativeDriver: false
        // }).start();
      });
    } else if (dy - 20 > safeInsets.top) {
      interactionAnimatedRef.current = InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false
        }).start();
        // Animated.timing(paddingContainer, {
        //   toValue: 50,
        //   duration: 100,
        //   useNativeDriver: false
        // }).start();
      });
    }
  };

  const handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const comment = (item) => {
    navigation.navigate('DetailDomainScreen', {
      item: {
        ...item,
        score: item?.domain?.credderScore,
        follower: 0
      },
      refreshNews: onRefresh
    });
  };

  const blockNews = (itemNews) => {
    setIdBlock(itemNews.content.domain_page_id);
    setDomain(itemNews.domain.name);
  };

  const upvoteNews = async (itemNews) => {
    upVoteDomain(itemNews);
  };

  const downvoteNews = async (itemNews) => {
    downVoteDomain(itemNews);
  };

  const loadMoreData = async () => {
    if (postOffset > 0) {
      setRefreshing(true);
    }
    try {
      const res = await getDomains(postOffset);
      const newNews = [...news, ...res.data];
      const data = {
        ...res,
        data: newNews
      };
      setPostOffset(res.offset);
      setNews(newNews, dispatch);
      saveToCache(NEWS_CACHE, data);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  };

  const onBlockedDomain = (blockedDomain) => {
    if (!blockedDomain.data) return;

    const {domain_page_id} = blockedDomain.data;
    getSpecificCache(NEWS_CACHE, (cache) => {
      if (cache) {
        if (!cache?.data) {
          initData();
          return;
        }

        const filteredCache = cache.data.filter(
          (item) => item.content.domain_page_id !== domain_page_id
        );
        if (filteredCache.length === 0) {
          initData();
          return;
        }

        const newCache = {...cache};
        newCache.data = filteredCache;
        setNews(filteredCache, dispatch);
        saveToCache(NEWS_CACHE, newCache);
      } else {
        initData();
      }
    });
  };

  const keyExtractor = React.useCallback((item, index) => index.toString(), []);

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <StatusBar translucent={false} barStyle={'light-content'} />
        <Search animatedValue={offset} />
        {/* <Animated.View style={{paddingTop: Platform.OS === 'android' ? paddingContainer : 0}}> */}
        <View>
          <FlatList
            ref={listRef}
            contentInsetAdjustmentBehavior="automatic"
            keyExtractor={keyExtractor}
            onScrollBeginDrag={handleOnScrollBeginDrag}
            onScroll={handleScrollEvent}
            scrollEventThrottle={16}
            data={news}
            refreshControl={
              <RefreshControl
                tintColor={COLORS.white}
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            onEndReached={loadMoreData}
            contentContainerStyle={styles.flatlistContainer}
            style={{backgroundColor: COLORS.almostBlack}}
            initialNumToRender={2}
            maxToRenderPerBatch={2}
            updateCellsBatchingPeriod={10}
            windowSize={10}
            // onEndReachedThreshold={0.8}

            // onMomentumScrollEnd={setSelectedIndex}
            renderItem={({item, index}) => (
              <RenderItem
                key={index}
                item={item}
                onPressShare={ShareUtils.shareNews}
                onPressComment={(itemNews) => comment(itemNews)}
                onPressBlock={(itemNews) => blockNews(itemNews)}
                onPressUpvote={(itemNews) => upvoteNews(itemNews)}
                onPressDownVote={(itemNews) => downvoteNews(itemNews)}
                selfUserId={myProfile.user_id}
              />
            )}
          />
          {/* </Animated.View> */}
        </View>

        <BlockDomainComponent
          ref={refBlockDomainComponent}
          domain={domain}
          domainId={idBlock}
          screen="news_screen"
          getValueBlock={onBlockedDomain}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray6
  },
  containerLoading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  flatlistContainer: {
    paddingTop: 10,
    backgroundColor: COLORS.almostBlack
  }
});

export default React.memo(withInteractionsManaged(NewsScreen));
