import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, StyleSheet, View} from 'react-native';

import {colors} from '../../utils/colors';
import dimen from '../../utils/dimen';

const FULL_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0
  },
  cardContainer: () => ({
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT,
    width: FULL_WIDTH,
    borderBottomWidth: 7,
    borderBottomColor: colors.lightgrey,
    backgroundColor: 'white'
  }),
  cardMain: () => ({
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT,
    width: '100%'
  })
});

const TiktokScroll = (props) => {
  const {
    data,
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
  const flatListRef = React.useRef();

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
      ref={flatListRef}
      refreshing={refreshing}
      renderItem={({item, index}) => (
        <View key={index} testID="dataScroll" style={[styles.cardContainer()]}>
          <View key={index} style={styles.cardMain()}>
            {renderItem({item, index})}
          </View>
        </View>
      )}
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
