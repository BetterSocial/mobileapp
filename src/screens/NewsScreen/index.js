import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import {
  Animated,
  FlatList,
  InteractionManager,
  Platform,
  StyleSheet,
  View,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import BlockDomainComponent from '../../components/BlockDomain';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import RenderItem from './RenderItem';
import Search from './Search';
import ShareUtils from '../../utils/share'
import {COLORS,} from '../../utils/theme';
import {Context} from '../../context';
import {downVoteDomain, upVoteDomain} from '../../service/vote';
import {getDomainIdIFollow, getDomains} from '../../service/domain';
import {getUserId} from '../../utils/users';
import {setIFollow, setNews} from '../../context/actions/news';
import { getSpecificCache, saveToCache } from '../../utils/cache';
import { NEWS_CACHE } from '../../utils/cache/constant';

const NewsScreen = ({}) => {
  const navigation = useNavigation();
  const refBlockDomainComponent = React.useRef(null);
  const offset = React.useRef(new Animated.Value(0)).current;
  const paddingContainer = React.useRef(new Animated.Value(50)).current
  const [loading, setLoading] = React.useState(true);
  const [refreshing, setRefreshing] = React.useState(false);
  const [yourselfId, setYourselfId] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [idBlock, setIdBlock] = React.useState('');
  const [postOffset, setPostOffset] = React.useState(0)
  const [newslist, dispatch] = React.useContext(Context).news;
  const [isCompleteAnimation, setIsCompleteAnimation] = React.useState(false)
  
  const scrollRef = React.createRef();
  let {news} = newslist;
  let lastDragY = 0;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      Animated.timing(offset, {
        toValue: 0,
        duration: 0,
        useNativeDriver: false,
      }).start(() => {
        initData()

      });
    });

    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });

    return unsubscribe;
  }, []);

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {

   checkCache()
    getNewsIfollow();
  }, []);

  const checkCache = () => {
    // setLoading(true)
    getSpecificCache(NEWS_CACHE, (cache) => {
      if(cache) {
        setNews(cache.data, dispatch);
        setPostOffset(cache.offset)
        setLoading(false);
      } else {
        initData(true)
      }
    })
  }

  React.useEffect(() => {
    if(domain !== '' && idBlock !== '') {
      refBlockDomainComponent.current.openBlockDomain();
    }
  },[domain, idBlock])

  const initData = async (enableLoading) => {
    if(enableLoading) setLoading(true);
    try {
      let res = await getDomains();
      saveToCache(NEWS_CACHE, res)
      setNews(res.data, dispatch);
      setPostOffset(res.offset)
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      let res = await getDomains();
      setNews(res.data, dispatch);
      setPostOffset(res.offset)
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
    }
  }

  const getNewsIfollow = async () => {
    let res = await getDomainIdIFollow();
    setIFollow(res.data, dispatch);
  };

  let handleScrollEvent = (event) => {
    let y = event.nativeEvent.contentOffset.y;
    let dy = y - lastDragY;
    if (dy + 20 <= 0) {
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: 0,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(paddingContainer, {
          toValue: 50,
          duration: 100
        }).start()
      
      })

    } else if (dy - 20 > 0) {
 
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(offset, {
          toValue: -50,
          duration: 100,
          useNativeDriver: false,
        }).start();
        Animated.timing(paddingContainer, {
          toValue: 0,
          duration: 100
        }).start()
     
      })
    }
  };

  let handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const comment = (item) => {
    navigation.navigate('DetailDomainScreen', {
      item : { 
        ...item,
        score: item?.domain?.credderScore,
        follower: 0,
      }, 
      refreshNews: onRefresh});
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
    setRefreshing(true)
    try {
      let res = await getDomains(postOffset);
      let newNews = [...news, ...res.data];
      setPostOffset(res.offset)
      setNews(newNews, dispatch);
      setRefreshing(false)
      // setLoading(false);
    } catch (error) {
      setRefreshing(false)
      // setLoading(false);
    }
  };

  const setSelectedIndex = (event) => {
    // width of the view size
    const viewSize = event.nativeEvent.layoutMeasurement.height / 2;
    // get current position of the scroll view
    const contentOffSet = event.nativeEvent.contentOffset.y;
    const selectedIndex = Math.floor(contentOffSet / viewSize);
    const last = news.length - 1;
    if (selectedIndex === last) {
      const lastId = news[news.length - 1].id;
      loadMoreData(lastId);
    }
  };

  React.useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsCompleteAnimation(true)
    })
  })

  if(!isCompleteAnimation) {
    return null
  }

  if (loading) {
    return (
      <View style={styles.containerLoading}>
        <LoadingWithoutModal visible={loading} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Search animatedValue={offset} />
        <Animated.View style={{paddingTop: Platform.OS === 'android' ? paddingContainer : 0}} >
        <FlatList
          ref={scrollRef}
          keyExtractor={(item, index) => item.id}
          onScrollBeginDrag={handleOnScrollBeginDrag}
          onScroll={handleScrollEvent}
          scrollEventThrottle={16}
          data={news}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onEndReached={loadMoreData}
          contentContainerStyle={styles.flatlistContainer}
          // onMomentumScrollEnd={setSelectedIndex}
          renderItem={({item, index}) => {
            return (
              <RenderItem
                key={item.id}
                item={item}
                onPressShare={ShareUtils.shareNews}
                onPressComment={(itemNews) => comment(itemNews)}
                onPressBlock={(itemNews) => blockNews(itemNews)}
                onPressUpvote={(itemNews) => upvoteNews(itemNews)}
                onPressDownVote={(itemNews) => downvoteNews(itemNews)}
                selfUserId={yourselfId}
              />
            );
          }}
        />
        </Animated.View>
        

        <BlockDomainComponent
          ref={refBlockDomainComponent}
          domain={domain}
          domainId={idBlock}
          screen="news_screen" />
        

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray6,
  },
  containerLoading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  flatlistContainer: {
    paddingTop: 10
  }
});

export default NewsScreen;
