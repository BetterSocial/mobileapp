import * as React from 'react';
import analytics from '@react-native-firebase/analytics';
import { StyleSheet, View, Animated } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';

import BlockComponent from '../../components/BlockComponent';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';
import RenderListFeed from './RenderList';
import TiktokScroll from '../../components/TiktokScroll';
import dimen from '../../utils/dimen';
import { ButtonNewPost } from '../../components/Button';
import { Context } from '../../context';
import { downVote, upVote } from '../../service/vote';
import { getFeedDetail, getMainFeed } from '../../service/post';
import { getUserId } from '../../utils/users';
import { linkContextScreenParamBuilder } from '../../utils/navigation/paramBuilder';
import { setFeedByIndex, setMainFeeds } from '../../context/actions/feeds';
import Search from './elements/Search';

let lastDragY = 0;

const FeedScreen = (props) => {
  const navigation = useNavigation();
  const [initialLoading, setInitialLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [countStack, setCountStack] = React.useState(null);
  const [lastId, setLastId] = React.useState('');
  const [yourselfId, setYourselfId] = React.useState('');
  const [time, setTime] = React.useState(new Date());

  const offset = React.useRef(new Animated.Value(-70)).current

  const refBlockComponent = React.useRef();
  const [feedsContext, dispatch] = React.useContext(Context).feeds;
  const bottomBarHeight = useBottomTabBarHeight();

  let { feeds } = feedsContext;

  const getDataFeeds = async (id = '') => {
    setCountStack(null);
    setLoading(true);
    try {
      let query = '';
      if (id !== '') {
        query = '?id_lt=' + id;
      }

      const dataFeeds = await getMainFeed(query);
      if (dataFeeds.data.length > 0) {
        let data = dataFeeds.data;
        if (id === '') {
          setMainFeeds(data, dispatch);
        } else {
          setMainFeeds([...feeds, ...data], dispatch);
        }
        setCountStack(data.length);
      }
      setLoading(false);
      setInitialLoading(false);
      setTime(new Date());
      setLoading(false);
    } catch (e) {
      setInitialLoading(false);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed Screen',
    });
  }, []);

  React.useEffect(() => {
    const unsubscribe = navigation.addListener('tabPress', (e) => {
      getDataFeeds(lastId);
    });

    return unsubscribe;
  }, [navigation, lastId]);

  React.useEffect(() => {
    getDataFeeds(lastId);
  }, []);

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

  React.useEffect(() => {
    const parseToken = async () => {
      const id = await getUserId();
      if (id) {
        setYourselfId(id);
      }
    };
    parseToken();
  }, []);

  let onNewPollFetched = (newPolls, index) => {
    setFeedByIndex(
      {
        index: index,
        singleFeed: newPolls,
      },
      dispatch,
    );
  };

  if (initialLoading === true) {
    return (
      <View style={styles.containerLoading}>
        <LoadingWithoutModal visible={initialLoading} />
      </View>
    );
  }

  const onPressDomain = (item) => {
    let param = linkContextScreenParamBuilder(
      item,
      item.og.domain,
      item.og.domainImage,
      item.og.domain_page_id,
    );
    props.navigation.navigate('DomainScreen', param);
  };

  const onEndReach = () => {
    getDataFeeds(feeds[feeds.length - 1].id);
  };

  const onPress = (item, index) => {
    props.navigation.navigate('PostDetailPage', {
      index: index,
      isalreadypolling: item.isalreadypolling,
    });
  };

  const onPressComment = (index) => {
    props.navigation.navigate('PostDetailPage', {
      index: index,
    });
  };

  const onPressBlock = (value) => {
    refBlockComponent.current.openBlockComponent(value);
  };

  const onRefresh = () => {
    getDataFeeds('');
  };

  let handleScrollEvent = (event) => {
    console.log(event.nativeEvent)
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

  let handleSearchBarClicked = () => {
    console.log('search bar clicked')
    navigation.navigate('DiscoveryScreen')
  }

  return (
    <View style={styles.container} forceInset={{ top: 'always' }}>
      <Search animatedValue={offset} onContainerClicked={handleSearchBarClicked}/>
      <TiktokScroll
        contentHeight={dimen.size.FEED_CURRENT_ITEM_HEIGHT(bottomBarHeight)}
        data={feeds}
        onEndReach={onEndReach}
        onRefresh={onRefresh}
        onScroll={handleScrollEvent}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        refreshing={loading}>
        {({ item, index }) => (
          <RenderListFeed
            item={item}
            onNewPollFetched={onNewPollFetched}
            index={index}
            onPressDomain={onPressDomain}
            onPress={() => onPress(item, index)}
            onPressComment={() => onPressComment(index)}
            onPressBlock={() => onPressBlock(item)}
            onPressUpvote={(post) => setUpVote(post, index)}
            selfUserId={yourselfId}
            onPressDownVote={(post) => setDownVote(post, index)}
            loading={loading}
          />
        )}
      </TiktokScroll>
      <ButtonNewPost />
      <BlockComponent ref={refBlockComponent} refresh={getDataFeeds} screen="screen_feed" />
    </View>

  );
};

export default FeedScreen;
const styles = StyleSheet.create({
  container: { flex: 1 },
  content: {
    flex: 5,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: -1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  flatlistContainer: {
    paddingBottom: 0,
  },
});
