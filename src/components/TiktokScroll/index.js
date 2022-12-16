import * as React from 'react';
import PropTypes from 'prop-types';
import {Dimensions, FlatList, StatusBar, StyleSheet, View} from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useSafeAreaFrame, useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors } from '../../utils/colors';
import dimen from '../../utils/dimen';


const FULL_WIDTH = Dimensions.get('screen').width;

const styles = StyleSheet.create({
  flatlistContainer: {
    paddingBottom: 0,
  },
  cardContainer: () => ({
    height: dimen.size.FEED_CURRENT_ITEM_HEIGHT,
    width: FULL_WIDTH,
    borderBottomWidth: 7,
    borderBottomColor: colors.lightgrey,
    backgroundColor: 'white',

  }),
  cardMain: () => ({
      height: dimen.size.FEED_CURRENT_ITEM_HEIGHT ,
      width: '100%',
  }),
});

const TiktokScroll = (props) => {
  const {data, children, onRefresh, refreshing, onEndReach, contentHeight = 548, onScroll, onScrollBeginDrag, onMomentumScrollEnd, searchHeight, showSearchBar, ...otherProps} = props;
  const flatListRef = React.useRef();

  return (
    <FlatList
      contentInsetAdjustmentBehavior='automatic'
      contentContainerStyle={[styles.flatlistContainer, {paddingTop: showSearchBar ? searchHeight : 0}]}
      data={data}
      decelerationRate="normal"
      disableIntervalMomentum={true}
      keyExtractor={(item) => item.id}
      onEndReached={onEndReach}
      onRefresh={onRefresh}
      onScroll={onScroll}
      onScrollBeginDrag={onScrollBeginDrag}
      getItemLayout={(data, index) => ({
        length: contentHeight, offset: contentHeight * index, index
      })}
    
      onMomentumScrollEnd={onMomentumScrollEnd}
      initialNumToRender={2}
      ref={flatListRef}
      refreshing={refreshing}
      renderItem={({item ,index}) => (
        <View testID='dataScroll' style={[styles.cardContainer()]}>
        <View style={styles.cardMain()}>
          {children({item, index})}
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
  data: PropTypes.array.isRequired,
  children: PropTypes.node.isRequired,
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
