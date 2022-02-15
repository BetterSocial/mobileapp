import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import {
  Animated,
  FlatList,
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

const NewsScreen = ({}) => {
  const navigation = useNavigation();
  const refBlockDomainComponent = React.useRef(null);
  const offset = React.useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [yourselfId, setYourselfId] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [idBlock, setIdBlock] = React.useState('');
  const [newslist, dispatch] = React.useContext(Context).news;
  const scrollRef = React.createRef();
  let {news} = newslist;
  let lastDragY = 0;
  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      initData();
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
    initData();
    getNewsIfollow();
  }, []);

  React.useEffect(() => {
    if(domain !== '' && idBlock !== '') {
      refBlockDomainComponent.current.openBlockDomain();
    }
  },[domain, idBlock])

  const initData = async () => {
    setLoading(true);
    try {
      let res = await getDomains();
      setNews([{dummy: true}, ...res.data], dispatch);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true)
    try {
      let res = await getDomains();
      setNews([{dummy: true}, ...res.data], dispatch);
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
    if (dy <= 0) {
      return Animated.timing(offset, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }).start();
    } else if (dy > 0) {
      return Animated.timing(offset, {
        toValue: -70,
        duration: 50,
        useNativeDriver: false,
      }).start();
    }
  };

  let handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const comment = (item) => {
    navigation.navigate('DetailDomainScreen', {item});
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

  const loadMoreData = async (lastId) => {
    setLoading(true);
    try {
      let res = await getDomains(lastId);
      let newNews = [...news, ...res.data];
      setNews([{dummy: true}, ...newNews], dispatch);
      setLoading(false);
    } catch (error) {
      setLoading(false);
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
      <Animated.View>
        <FlatList
          ref={scrollRef}
          keyExtractor={(item, index) => item.id}
          onScrollBeginDrag={handleOnScrollBeginDrag}
          onScroll={handleScrollEvent}
          scrollEventThrottle={16}
          data={news}
          refreshing={refreshing}
          onRefresh={onRefresh}
          onMomentumScrollEnd={setSelectedIndex}
          renderItem={({item, index}) => {
            if (item.dummy) {
              return <View key={index} style={{height: 55}} />;
            }
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

        <BlockDomainComponent
          ref={refBlockDomainComponent}
          domain={domain}
          domainId={idBlock}
          screen="news_screen" />
        
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.gray6,
  },
  containerLoading: {flex: 1, justifyContent: 'center', alignItems: 'center'},
});

export default NewsScreen;
