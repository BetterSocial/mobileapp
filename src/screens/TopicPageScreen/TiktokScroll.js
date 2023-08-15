import * as React from 'react';
import {FlatList, StyleSheet, Dimensions, StatusBar} from 'react-native';
import PropTypes from 'prop-types';
import Empty from './elements/Empty';

const FULL_HEIGHT = Dimensions.get('screen').height;
const tabBarHeight = StatusBar.currentHeight;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0
  }
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach} = props;
  const flatListRef = React.useRef();
  const deviceHeight = FULL_HEIGHT - tabBarHeight;

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
      ListEmptyComponent={<Empty />}
    />
  );
};

TiktokScroll.propTypes = {
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null
};

export default TiktokScroll;
