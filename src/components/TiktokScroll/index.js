import * as React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach} = props;
  const flatListRef = React.useRef();
  const [beginScroll, setBeginScroll] = React.useState(0);

  const endDrag = ({nativeEvent}) => {
    let index =
      nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height;
    if (beginScroll < nativeEvent.contentOffset.y) {
      index = index + 0.1;
    } else {
      index = index - 0.1;
    }
    const round = Math.round(index);
    if (round === data.length - (data.length - (data.length - 1))) {
      onEndReach();
    }
    flatListRef.current.scrollToIndex({
      index: round,
    });
  };

  const handleBeginDragScroll = ({nativeEvent}) => {
    setBeginScroll(nativeEvent.contentOffset.y);
  };

  return (
    <FlatList
      data={data}
      renderItem={children}
      keyExtractor={(item) => {
        return item.id;
      }}
      showsVerticalScrollIndicator={false}
      snapToInterval={20}
      snapToAlignment="center"
      decelerationRate="fast"
      contentContainerStyle={styles.flatlistContainer}
      ref={flatListRef}
      onMomentumScrollEnd={endDrag}
      refreshing={refreshing}
      onRefresh={onRefresh}
      scrollEventThrottle={1}
      onScrollBeginDrag={handleBeginDragScroll}
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
