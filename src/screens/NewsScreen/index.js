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

import {getDomains} from '../../service/domain';
import theme, {COLORS, FONTS, SIZES} from '../../utils/theme';
import RenderItem from './RenderItem';
import Search from './Search';

const NewsScreen = (props) => {
  const [data, setData] = React.useState([]);
  const offset = React.useRef(new Animated.Value(0)).current;

  let lastDragY = 0;

  React.useEffect(() => {
    analytics().logScreenView({
      screen_class: 'FeedScreen',
      screen_name: 'Feed',
    });
  }, []);

  React.useEffect(() => {
    const initData = async () => {
      let res = await getDomains();
      setData([{dummy: 'dummy'}, ...res.data]);
    };
    initData();
  }, []);

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
            if (item.dummy) return <View key={index} style={{height: 60}} />;
            return <RenderItem key={item} item={item} />;
          }}
        />
      </Animated.View>
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
