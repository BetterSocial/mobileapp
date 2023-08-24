import * as React from 'react';
import PropTypes from 'prop-types';
import {FlatList, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0
  }
});

const TiktokScroll = (props) => {
  const {
    data,
    listRef,
    renderItem,
    onRefresh,
    refreshing,
    onEndReach,
    contentHeight = 548,
    onScroll,
    onScrollBeginDrag,
    onMomentumScrollEnd,
    searchHeight,
    showSearchBar,
    ...otherProps
  } = props;

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={[
        styles.flatlistContainer,
        {paddingTop: showSearchBar ? searchHeight : 0}
      ]}
      data={data}
      decelerationRate="fast"
      disableIntervalMomentum={true}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onRefresh={onRefresh}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      getItemLayout={(item, index) => ({
        length: contentHeight,
        offset: contentHeight * index,
        index
      })}
      onMomentumScrollEnd={onMomentumScrollEnd}
      initialNumToRender={2}
      ref={listRef}
      refreshing={refreshing}
      renderItem={renderItem}
      scrollEventThrottle={1}
      showsVerticalScrollIndicator={false}
      snapToAlignment="start"
      snapToInterval={contentHeight}
      maxToRenderPerBatch={2}
      updateCellsBatchingPeriod={10}
      windowSize={10}
      {...otherProps}
    />
  );
};

TiktokScroll.propTypes = {
  data: PropTypes.array,
  renderItem: PropTypes.func,
  onRefresh: PropTypes.func,
  refreshing: PropTypes.bool,
  onMomentumScrollEnd: PropTypes.func,
  onScrollBeginDrag: PropTypes.func,
  onEndReach: PropTypes.func,
  onScroll: PropTypes.func,
  searchHeight: PropTypes.number,
  showSearchBar: PropTypes.bool
};

TiktokScroll.defaultProps = {
  data: [],
  onEndReach: () => null,
  onScroll: () => {},
  onScrollBeginDrag: () => {},
  onMomentumScrollEnd: () => {}
};

export default TiktokScroll;
