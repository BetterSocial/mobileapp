import * as React from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';

import analytics from '@react-native-firebase/analytics';

import RenderItem from './RenderItem';

import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';

import {getDomains} from '../../service/domain';
import Search from './Search';
const NewsScreen = (props) => {
  const [data, setData] = React.useState([]);
  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
  }, []);

  React.useEffect(() => {
    const initData = async () => {
      let res = await getDomains();
      setData(res.data);
    };
    initData();
  }, []);

  return (
    <View style={styles.container}>
      <Search />
      <FlatList
        data={data}
        renderItem={({item, index}) => {
          return <RenderItem key={item} item={item} />;
        }}
      />
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
