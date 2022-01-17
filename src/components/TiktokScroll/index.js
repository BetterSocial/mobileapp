import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, StatusBar, StyleSheet} from 'react-native';
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';

import dimen from '../../utils/dimen';

const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach} = props;
  const flatListRef = React.useRef();
  // const deviceHeight = FULL_HEIGHT - tabBarHeight - useBottomTabBarHeight()
  const deviceHeight = dimen.size.FEED_CURRENT_ITEM_HEIGHT(useBottomTabBarHeight())


  return (
    <FlatList
      contentContainerStyle={styles.flatlistContainer}
      data={data}
      decelerationRate="fast"
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onRefresh={onRefresh}
      ref={flatListRef}
      refreshing={refreshing}
      renderItem={children}
      scrollEventThrottle={1}
      showsVerticalScrollIndicator={false}
      snapToAlignment="center"
      snapToInterval={deviceHeight}
    />
  );
};

TiktokScroll.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func,
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null,
};

export default TiktokScroll;
