import * as React from 'react';
import { FlatList, StyleSheet, Dimensions, StatusBar } from 'react-native';
import PropTypes from 'prop-types';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
});

const Tiktok = (props) => {
  const { data, children, onRefresh, refreshing, onEndReach, isBottomTabBar = true } = props;
  const flatListRef = React.useRef();
  const deviceHeight = FULL_HEIGHT - isBottomTabBar ? tabBarHeight : null - useBottomTabBarHeight()


  return (
    <FlatList
      data={data}
      renderItem={children}
      keyExtractor={(item) => {
        return item.id;
      }}
      showsVerticalScrollIndicator={false}
      snapToInterval={deviceHeight}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerStyle={styles.flatlistContainer}
      ref={flatListRef}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollEventThrottle={1}
      onEndReached={onEndReach}
    />
  );
};

Tiktok.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func,
  isBottomTabBar: PropTypes.bool,
};

Tiktok.defaultProps = {
  data: [],
  onEndReach: () => null,
};

function compare(prevProps, nextProps) {

  return JSON.stringify(prevProps) === JSON.stringify(nextProps);
}

const TiktokScroll = React.memo(Tiktok, compare);

export default TiktokScroll;
