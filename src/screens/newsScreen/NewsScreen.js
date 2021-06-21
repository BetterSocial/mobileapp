import * as React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import analytics from '@react-native-firebase/analytics';

import {getDomains} from '../../service/domain';
import RenderItem from './RenderItem';
import {Loading} from '../../components';
import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';

import Search from './Search';
const NewsScreen = ({navigation}) => {
  const [data, setData] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
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

  return (
    <View style={styles.container}>
      <Search onPress={() => goToScreenCreatePost()} />
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return <RenderItem key={item} item={item} />;
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
