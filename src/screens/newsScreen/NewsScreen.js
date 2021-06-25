import * as React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import analytics from '@react-native-firebase/analytics';
import Toast from 'react-native-simple-toast';
import JWTDecode from 'jwt-decode';

import {getDomains} from '../../service/domain';
import {upVote, downVote} from '../../service/vote';
import RenderItem from './RenderItem';
import {Loading} from '../../components';
import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';

import Search from './Search';
import {getAccessToken} from '../../utils/token';
const NewsScreen = ({navigation}) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [yourselfId, setYourselfId] = React.useState('');
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
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
    setLoading(true);
    const initData = async () => {
      try {
        let res = await getDomains();
        setData(res.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const goToScreenCreatePost = () => navigation.navigate('CreatePost');

  const shareNews = (news) => {};

  const comment = (news) => {
    alert('comment');
  };

  const blockNews = (news) => {};

  const upvoteNews = async (news) => {
    console.log(news);
    // let result = await upVote({activity_id: news.id});
    // if (result.code === 200) {
    //   Toast.show('up vote was successful', Toast.LONG);
    // } else {
    //   Toast.show('up vote failed', Toast.LONG);
    // }
  };

  const downvoteNews = async (news) => {
    console.log(news);
    // let result = await downVote({activity_id: news.id});
    // if (result.code === 200) {
    //   Toast.show('down vote success', Toast.LONG);
    // } else {
    //   Toast.show('down vote failed', Toast.LONG);
    // }
  };

  console.log('news screen');

  return (
    <View style={styles.container}>
      <Search onPress={() => goToScreenCreatePost()} />
      <FlatList
        data={data}
        renderItem={({item}) => {
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: SIZES.base,
    backgroundColor: 'white',
  },
});

export default NewsScreen;
