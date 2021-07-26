import * as React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Animated,
  ScrollView,
  PanResponder,
} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-simple-toast';
import JWTDecode from 'jwt-decode';
import {useNavigation} from '@react-navigation/native';

import {upVoteDomain, downVoteDomain} from '../../service/vote';
import {Loading} from '../../components';
import {getAccessToken} from '../../utils/token';
import {getDomains} from '../../service/domain';
import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';
import RenderItem from './RenderItem';
import Search from './Search';

const NewsScreen = ({}) => {
  const navigation = useNavigation();
  const [data, setData] = React.useState([]);
  const offset = React.useRef(new Animated.Value(0)).current;

  const [loading, setLoading] = React.useState(false);
  const [yourselfId, setYourselfId] = React.useState('');

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
      const value = await getAccessToken();
      if (value) {
        const decoded = await JWTDecode(value);
        setYourselfId(decoded.user_id);
      }
    };
    parseToken();
  }, []);

  React.useEffect(() => {
    initData();
  }, []);

  const initData = async () => {
    setLoading(true);
    try {
      let res = await getDomains();
      setData([{dummy: true}, ...res.data]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  let handleScrollEvent = (event) => {
    let y = event.nativeEvent.contentOffset.y;
    let dy = y - lastDragY;
    if (dy <= 0)
      return Animated.timing(offset, {
        toValue: 0,
        duration: 50,
        useNativeDriver: false,
      }).start();
    else if (dy > 0)
      return Animated.timing(offset, {
        toValue: -70,
        duration: 50,
        useNativeDriver: false,
      }).start();
  };

  let handleOnScrollBeginDrag = (event) => {
    lastDragY = event.nativeEvent.contentOffset.y;
  };

  const goToScreenCreatePost = () => navigation.navigate('CreatePost');

  const shareNews = (news) => {};

  const comment = (news) => {
    navigation.navigate('DetailDomainScreen', {item: news});
  };

  const blockNews = (news) => {};

  const upvoteNews = async (news) => {
    // console.log(news);
    upVoteDomain(news);
    // if (result.code === 200) {
    //   Toast.show('up vote was successful', Toast.LONG);
    // } else {
    //   Toast.show('up vote failed', Toast.LONG);
    // }
  };

  const downvoteNews = async (news) => {
    console.log(news);
    downVoteDomain(news);
    // if (result.code === 200) {
    //   Toast.show('down vote success', Toast.LONG);
    // } else {
    //   Toast.show('down vote failed', Toast.LONG);
    // }
  };
  console.log('news screen');

  return (
    <View style={styles.container}>
      <Search animatedValue={offset} />
      <Animated.View>
        <FlatList
          onScrollBeginDrag={handleOnScrollBeginDrag}
          onScroll={handleScrollEvent}
          scrollEventThrottle={16}
          data={data}
          renderItem={({item, index}) => {
            if (item.dummy) return <View key={index} style={{height: 68}} />;
            return (
              <RenderItem
                key={item}
                item={item}
                onPressShare={(news) => shareNews(news)}
                onPressComment={(news) => comment(news)}
                onPressBlock={(news) => blockNews(news)}
                onPressUpvote={(news) => upvoteNews(news)}
                onPressDownVote={(news) => downvoteNews(news)}
                selfUserId={yourselfId}
              />
            );
          }}
        />

        <Loading visible={loading} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // paddingTop: SIZES.base,
    backgroundColor: COLORS.gray6,
  },
});

export default NewsScreen;
