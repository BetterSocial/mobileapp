import * as React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Animated,
  RefreshControl,
  StatusBar,
} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-simple-toast';
import {useNavigation} from '@react-navigation/native';

import {upVoteDomain, downVoteDomain} from '../../service/vote';
import {Loading} from '../../components';
import {getDomainIdIFollow, getDomains} from '../../service/domain';
import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';
import RenderItem from './RenderItem';
import Search from './Search';
import BlockDomain from '../../components/Blocking/BlockDomain';
import SpecificIssue from '../../components/Blocking/SpecificIssue';
import ReportDomain from '../../components/Blocking/ReportDomain';
import {blockDomain} from '../../service/blocking';
import {Context} from '../../context';
import {setIFollow, setNews} from '../../context/actions/news';
import {getUserId} from '../../utils/users';
import LoadingWithoutModal from '../../components/LoadingWithoutModal';

const NewsScreen = ({}) => {
  const navigation = useNavigation();
  const blockDomainRef = React.useRef(null);
  const refSpecificIssue = React.useRef(null);
  const refReportDomain = React.useRef(null);
  const offset = React.useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [yourselfId, setYourselfId] = React.useState('');
  const [domain, setDomain] = React.useState('');
  const [reportOption, setReportOption] = React.useState([]);
  const [messageReport, setMessageReport] = React.useState('');
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

  const shareNews = (value) => {};

  const comment = (item) => {
    navigation.navigate('DetailDomainScreen', {item});
  };

  const blockNews = (itemNews) => {
    blockDomainRef.current.open();
    setIdBlock(itemNews.content.domain_page_id);
    setDomain(itemNews.domain.name);
  };
  const selectBlock = (v) => {
    if (v === 1) {
      onBlockDomain();
    } else {
      refReportDomain.current.open();
    }
    blockDomainRef.current.close();
  };
  const getSpecificIssue = (v) => {
    setMessageReport(v);
    refSpecificIssue.current.close();
    setTimeout(() => {
      onBlockDomain();
    }, 500);
  };
  const onSkipOnlyBlock = () => {
    refReportDomain.current.close();
    refSpecificIssue.current.close();
    onBlockDomain();
  };
  const onNextQuestion = (v) => {
    setReportOption(v);
    refReportDomain.current.close();
    refSpecificIssue.current.open();
  };

  const onBlockDomain = async () => {
    const dataBlock = {
      domainId: idBlock,
      reason: reportOption,
      message: messageReport,
      source: 'domain_screen',
    };
    const result = await blockDomain(dataBlock);
    if (result.code === 200) {
      Toast.show(
        'The user was blocked successfully. \nThanks for making BetterSocial better!',
        Toast.LONG,
      );
    } else {
      Toast.show('Your report was filed & will be investigated', Toast.LONG);
    }
    console.log('result block user ', result);
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

  // if (loading) {
  //   return (
  //     <View style={styles.containerLoading}>
  //       <LoadingWithoutModal visible={loading} />
  //     </View>
  //   );
  // }

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
          onMomentumScrollEnd={setSelectedIndex}
          renderItem={({item, index}) => {
            if (item.dummy) {
              return <View key={index} style={{height: 55}} />;
            }
            return (
              <RenderItem
                key={item.id}
                item={item}
                onPressShare={(itemNews) => shareNews(itemNews)}
                onPressComment={(itemNews) => comment(itemNews)}
                onPressBlock={(itemNews) => blockNews(itemNews)}
                onPressUpvote={(itemNews) => upvoteNews(itemNews)}
                onPressDownVote={(itemNews) => downvoteNews(itemNews)}
                selfUserId={yourselfId}
              />
            );
          }}
        />

        <BlockDomain
          refBlockDomain={blockDomainRef}
          onSelect={selectBlock}
          domain={domain}
        />
        <SpecificIssue
          refSpecificIssue={refSpecificIssue}
          onPress={getSpecificIssue}
          onSkip={onSkipOnlyBlock}
        />
        <ReportDomain
          refReportDomain={refReportDomain}
          onSkip={onSkipOnlyBlock}
          onSelect={onNextQuestion}
        />
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
