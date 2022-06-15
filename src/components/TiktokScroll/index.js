import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, StatusBar, StyleSheet} from 'react-native';

import dimen from '../../utils/dimen';

const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach, contentHeight, onScroll, onScrollBeginDrag, onMomentumScrollEnd, ...otherProps} = props;
  const flatListRef = React.useRef();

  const __onViewambleItemsChanged = React.useCallback(({ viewableItems, changed}) => {
    // console.log("Visible items are", viewableItems);
    // console.log("Changed in this iteration", changed);
  }, [])

  return (
    <FlatList
      contentContainerStyle={styles.flatlistContainer}
      data={data}
      decelerationRate="fast"
      disableIntervalMomentum={true}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onRefresh={onRefresh}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      // onViewableItemsChanged={__onViewambleItemsChanged}
      onMomentumScrollEnd={onMomentumScrollEnd}
      ref={flatListRef}
      refreshing={refreshing}
      renderItem={children}
      scrollEventThrottle={1}
      showsVerticalScrollIndicator={false}
      snapToAlignment="center"
      snapToInterval={contentHeight}
      {...otherProps}
    />
  );
};

TiktokScroll.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onMomentumScrollEnd: PropTypes.func,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func,
  onScroll: PropTypes.func,
  onScrollBeginDrag: PropTypes.func
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null,
  onScroll: () => {},
  onScrollBeginDrag: () => {},
  onMomentumScrollEnd: () => {}
};

export default TiktokScroll;
